const path = require("path");
const deepForEach = require("deep-for-each");

/**
 * @param name
 * @param checkFun 不成立条件【继续改名的条件】
 */
function checkName(name, checkFun) {
    const hasName = checkFun(name);
    const lastNumReg = /((?!0)\d+)$/;

    if (hasName) {
        let newName = "";
        if (!lastNumReg.test(name)) {
            newName = `${name}1`;
        } else {
            newName = name.replace(lastNumReg, ($1) => `${Number($1) + 1}`);
        }
        return checkName(newName, checkFun);
    }
    return name;
}
function fixConvertErr(json) {
    const modifyList = [];
    const warnList = [];
    const errorList = [];

    const pack = require(path.join(__dirname, "./package.json"));

    deepForEach(json, (value, key, subject) => {
        if (key === "$ref" && typeof value === "string") {
            const dataKey = value.replace("#/definitions/", "");
            if (!json.definitions[dataKey]) {
                json.definitions[dataKey] = {
                    type: "object",
                    required: [],
                    properties: {},
                    description: "Automatically created",
                };
            }
        }

        if (key === "parameters" && Array.isArray(value)) {
            const noType = value.filter((i) => {
                if (/^formData$/i.test(i.in)) i.in = "body";
                return i.in === undefined;
            });
            noType.forEach((i) => {
                i.in = "query";
                warnList.push({
                    msg: `参数 ${i.name} 异常, 不存在请求类型，已归纳为 query 类型`,
                });
            });
            const bodyParams = value.filter((i) => i.in === "body");

            if (bodyParams.length > 1) {
                warnList.push({
                    msg: `数据结构异常：${subject.operationId}，parameters里存在${bodyParams.length}个body数据，已修正。`,
                });
                const names = Object.keys(json.definitions);
                const parameters = value.filter((i) => i.in !== "body");
                let name = `M${subject.operationId}Body`;
                name = checkName(name, (n) => names.includes(n));
                const schema = {
                    $ref: `#/definitions/${name}`,
                    originalRef: name,
                };
                const bodyRef = {
                    required: true,
                    in: "body",
                    name,
                    description: name,
                    schema,
                };
                parameters.push(bodyRef);
                subject.parameters = parameters;

                // 添加 definition
                const required = [];
                const properties = {};
                bodyParams.forEach((i) => {
                    if (i.required) required.push(i.name);
                    properties[i.name] = {
                        ...i.schema,
                        description: i.description,
                    };
                });
                const definition = {
                    type: "object",
                    required,
                    properties,
                    title: `auto generated  by ${pack.name}`,
                    description: `auto generated  by ${pack.name}`,
                };

                json.definitions[name] = definition;
            }
        }
        if (key === "in" && value === "path") {
            if (!subject.required) {
                warnList.push({
                    msg: `路径参数异常 ${subject.name}, path 参数必须为必传， 已修正。`,
                });
                subject.required = true;
            }
        } else if (key === "originalRef") {
            const ref = subject.$ref;
            const newValue = value.replace(/\//g, "");
            if (!ref || value === newValue) return;

            const modifyItem = modifyList.find((i) => i.ref === ref);
            if (!modifyItem) {
                modifyList.push({ value, newValue, ref, subjects: [subject] });
            } else {
                modifyItem.subjects.push(subject);
            }
        }
    });
    modifyList.forEach(({ value, newValue, ref, subjects }) => {
        newValue = checkName(
            newValue,
            (n) => json.definitions[n] !== undefined
        );
        if (value === newValue) return;
        json.definitions[newValue] = json.definitions[value];
        delete json.definitions[value];

        subjects.forEach((subject) => {
            subject.originalRef = newValue;
            const ref = subject.$ref + pack.name;
            subject.$ref = ref.replace(value + pack.name, newValue);
        });
    });

    // fix empty ref
    deepForEach(json, (value, key) => {
        if (key === "originalRef") {
            if (!json.definitions[value]) {
                json.definitions[value] = {
                    type: "object",
                    title: `auto generated  by ${pack.name}`,
                };
            }
        }
    });

    return { warnList, errorList };
}

module.exports = {
    fixConvertErr,
};

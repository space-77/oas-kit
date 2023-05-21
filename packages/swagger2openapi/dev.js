const fs = require("fs");
const path = require("path");
const converter = require("./index");

const { fixConvertErr } = require("./utils");

// converter.convertObj();
function main() {
    const data = require(path.join(__dirname, "./mock/sw2.json"));
    fixConvertErr(data);

    converter.convertObj(data, { components: true }, function (err, options) {
        if (err) {
            console.log(err.message);
            return;
        }

        fs.writeFileSync(
            path.join(__dirname, "./mock/openapi3.json"),
            JSON.stringify(options.openapi, null, 2)
        );

        // console.log(options);

        // const json = options.openapi;
        // formatOpenapi3Name(json, newDictList, translateType);

        // resolve({ json, dictList: newDictList });
    });
}

main();

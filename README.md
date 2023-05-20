# OAS-Kit

This is the mono-repo for the following related projects

* [swagger2openapi](packages/swagger2openapi/README.md)
* [oas-validator](packages/oas-validator/README.md)
* [oas-linter](packages/oas-linter/README.md)
* [oas-resolver](packages/oas-resolver/README.md)
* [oas-schema-walker](packages/oas-schema-walker/README.md)
* [oas-kit-common](packages/oas-kit-common/README.md)
* [reftools](packages/reftools/README.md)

## Documentation

* [Main site](https://mermade.github.io/oas-kit)
* [CHANGELOG](https://github.com/space-77/oas-kit/blob/master/CHANGELOG.md#change-log)

## Online converter/validator

* [OpenAPI-webconverter](https://mermade.org.uk/openapi-converter)

## Supported Node.js versions

Any LTS version. It is **not** recommended to use Node.js 12.17.x,12.18.x or 12.19.x due to an [http2 bug](https://github.com/nodejs/node/issues/28001).

## Development

* clone the repository
* `npm i` in the top level directory
* `npx lerna bootstrap`

Please try and keep commits related to a single package or piece of functionality. Please review the
[CONTRIBUTING.md](CONTRIBUTING.md) for additional details.

## Supporting development

* [APIs.guru open-collective](https://opencollective.com/openapi-directory)
* [Linode VPS referral link](https://www.linode.com/?r=5734be467cc501b23267cf66d451bc339042ddfa)

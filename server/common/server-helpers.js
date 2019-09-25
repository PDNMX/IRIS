import Promise from 'bluebird';
import nodemailer from 'nodemailer';
import Baby from 'babyparse';
import _ from 'lodash';
import base64 from 'base-64';
import utf8 from 'utf8';

let transporter;

class Pipeline {
    constructor(handlers) {
        if (!handlers)
            this.handlers = [];
        else
            this.handlers = handlers;
    }

    use(handler) {
        this.handlers.push(handler);
        return this;
    }

    start(output) {
        if (!output) {
            output = {};
        }

        return new Promise((resolve) => {
            let index = 0;

            const next = function () {
                if (
                    index === this.handlers.length ||
                    output.pass ||
                    (!output.pass && !!output.required && output.required)
                ) {
                    resolve(output);
                } else {
                    let h = this.handlers[index++];
                    h(output, next);
                }
            }.bind(this);

            next();
        });
    }
}

export default {
    isPositive(value) {
        if (parseInt(value) < 0) {
            throw new Error('Solo valores positivos son permitidos');
        }
    },
    isInRange(value, a, b) {
        const numValue = parseInt(value);
        if (!(numValue >= a && numValue <= b)) {
            throw new Error(`El valor no está dentro del rango [${a}, ${b}]`);
        }
    },
    minLength(value, minLengthArg) {
        if (value.length < minLengthArg) {
            throw new Error(`El tamaño mínimo es de ${minLengthArg} carácteres`);
        }
    },
    maxLength(value, maxLengthArg) {
        if (value.length > maxLengthArg) {
            throw new Error(`El tamaño máximo es de ${maxLengthArg} carácteres`);
        }
    },
    notStartsEndsWithBlanks(value) {
        if (value.trim().length != value.length) {
            throw new Error(`El campo no puede comenzar o terminar con caracteres en blanco`);
        }
    },
    pipeline(handlers) {
        return new Pipeline(handlers).start();
    },
    sequence(callbacks) {
        return new Pipeline(callbacks.map(cb => (output, next) => {
            cb().then(result => {
                output.pass = false;
                output.result.push(result);
                next();
            });
        })).start({result: []});
    },
    sendEmail(mailOptions, smtpConfig) {
        console.log('SMTP', smtpConfig);

        if (!transporter) {
            transporter = nodemailer.createTransport(smtpConfig);
        }

        return transporter.sendMail(mailOptions);
    },
    dataToCSV(data, fields) {
        if (data instanceof Array) {
            return Baby.unparse(data.map(row => {
                let dict = {};
                _.map(row, (r, n) => dict[fields[n]] = r);
                return dict;
            }), {quotes: true});
        }
    },
    csvToData(content) {
        const encoded = content.split(",").pop(),
            bytes = base64.decode(encoded),
            text = utf8.decode(bytes),
            parsedData = Baby.parse(text, {header: true});

        return !!parsedData ? parsedData.data : undefined;
    },
    async createInstances(content, fields, parentId, registeredUser, createCallback, ignoreFields = false) {
        const table = this.csvToData(content),
            rootId = registeredUser.rootId;

        if (ignoreFields) {
            return this.sequence(
                table.map(instance => async () => {
                    try {
                        return await createCallback(rootId, instance, parentId, registeredUser);
                    } catch (e) {
                        return instance;
                    }
                })
            );
        } else {
            return this.sequence(
                table.map(row => async () => {
                    let instance = {};
                    _.map(row, (c, n) => instance[fields[n]] = c);

                    try {
                        return await createCallback(rootId, instance, parentId, registeredUser);
                    } catch (e) {
                        return instance;
                    }
                })
            );
        }
    },
    promise(res) {
        return new Promise(resolve => resolve(res));
    },
    equal(a, b) {
        if (a != b) throw new Error(`${a} no es igual a ${b}`);
    },
    greater(a, b) {
        if (a <= b) throw new Error(`${a} es menor igual a ${b}`);
    },
    less(a, b) {
        if (a >= b) throw new Error(`${a} es mayor igual a ${b}`);
    },
    greaterEqual(a, b) {
        if (a < b) throw new Error(`${a} es menor a ${b}`);
    },
    lessEqual(a, b) {
        if (a > b) throw new Error(`${a} es mayor a ${b}`);
    },
    regexp(value, re) {
        if (!(!(value !== null && value !== undefined) || value === '' || new RegExp(re).test(value))) {
            throw new Error(`El campo no cumple el patrón [${re}]`);
        }
    }
};
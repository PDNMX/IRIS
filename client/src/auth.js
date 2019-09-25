import rp from 'request-promise';

export default {
    setHost(host) {
        localStorage.host = host;
    },
    getHost() {
        return localStorage.host;
    },
    login(email, password, cb) {
        cb = arguments[arguments.length - 1];

        if (localStorage.token) {
            if (cb) {
                cb(true);
            }

            this.onChange(true, false);
            return;
        }

        rp({
            method: 'POST',
            uri: `${this.getHost()}/login`,
            form: { email, password },
            json: true
        }).then((res) => {
            console.log(res);

            if (res.authenticated) {
                localStorage.token = res.token;
                localStorage.permissions = JSON.stringify(res.permissions);
                localStorage.user = JSON.stringify(res.user);

                if (cb) {
                    cb(true);
                }

                this.onChange(true, true);
            } else {
                if (cb) {
                    cb(false, res.fields);
                }

                this.onChange(false, false);
            }

        }).catch(function(err) {
            console.log(err);
        });
    },

    getToken() {
        return localStorage.token;
    },

    getRootId() {
        return 1;
    },

    getUser() {
        if(!!localStorage.user) {
            return JSON.parse(localStorage.user);
        }
        else {
            return { email: '' };
        }
    },

    logout(cb) {
        delete localStorage.token;
        delete localStorage.permissions;
        delete localStorage.user;

        if (cb) cb();
        this.onChange(false);
    },

    loggedIn() {
        return !!localStorage.token;
    },

    isInRole(role) {
        return this.getUser().role === role;
    },

    getData(query) {
        const token = this.getToken();
        let options = {
            method: 'POST',
            uri: `${this.getHost()}/graphql`,
            body: {query},
            json: true
        };

        if (!!token) {
            options.headers = {
                'Authorization': `Bearer ${token}`
            };
        }

        return rp(options);
    },

    onChange() {

    },

    userCanPerformAction(modelName, action) {
        const permissions = JSON.parse(localStorage.permissions);

        return (
            permissions &&
            permissions[modelName] &&
            permissions[modelName][action] &&
            (permissions[modelName][action] === 'sibling' || permissions[modelName][action] === 'owner')
        );
    },

    
    userCanRead(modelName) {
        return this.userCanPerformAction(modelName, 'read');
    }
};
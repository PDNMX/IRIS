/*eslint no-extend-native: ["error", { "exceptions": ["String"] }]*/
import moment from 'moment';
import numeral from 'numeral';
import React from 'react';
import {Avatar, Icon} from 'antd';
import pluralize from 'pluralize';

String.prototype.capitalize = function() {
    return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } );
};

String.prototype.plural = function() {
    return pluralize(this);
};

String.prototype.toWords = function() {
    return this.match(/[A-Z][a-z]+|[0-9]+/g).join(' ');
};

String.prototype.singular = function() {
    return pluralize(this, 1);
};

String.prototype.isPlural = function() {
    return (this.charAt(this.length - 1).toLowerCase() === 's');
};

export default {
    attachment(value) {
        return <Avatar src={value} size={36}/>
    },
    getRawValue(value) {
        return (value)? value: '';
    },
    strong(value) {
        return <strong >{value}</strong>;
    },
    capitalize(value) {
        return this.getRawValue(value).capitalize();
    },
    currentYear() {
        return moment().format('YYYY');
    },
    percentage(value) {
        return numeral(value).format('0.00%');
    },
    percentageInt(value) {
        return numeral(value).format('0%');
    },
    formattedLocaleDate(value, { format }) {
        return moment(new Date(value)).format(format);
    },
    formattedDate(value, { format }) {
        return moment(new Date(value)).format(format);
    },
    formattedLLDate(value) {
        return moment(new Date(value)).format('LL');
    },
    booleanWord(value) {
        return (value === true)? 'Sí': 'No';
    },
    currency(value) {
        return numeral(value).format('$0,0');
    },
    currencyMillions(value) {
        return numeral(value/1000000).format('(0,0)');
    },
    mailTo(value) {
        return (<a href={`mailto:${value}`} style={ { textDecoration: 'none', color: '#757575' } }>{value}</a>);
    },
    linkTo(value, {href}) {
        return <a href={href}>{value}</a>;
    },
    linkButton(value, {href = undefined, onClick = undefined}) {
        let props = {};

        if (!!href) {
            props = {...props, href}
        }

        if (onClick instanceof Function) {
            props = {...props, onClick}
        }

        return <a {...props}>{value}</a>;
    },
    avatar(value) {
        return (<Avatar src={value} />);
    },
    toWords(value) {
        let result = '';

        if (value.length > 0) {
            result = this.getRawValue(value).capitalize().match(/[A-Z][a-z]+|[0-9]+/g).join(' ');
        }

        return result;
    },
    userInfo(user) {
        return (
            user.firstName
        );
    },
    contactName(contact) {
        return `${contact.firstName} ${contact.lastName}`;
    },
    userName(user) {
        return `${user.firstName} ${user.lastName}`;
    },
    bankName(bank) {
        return `${bank.shortName} (${bank.id})`
    },
    booleanIcon(value) {
        return value? <Icon type={'check'} style={{color: '#52c41a'}}/>: <Icon type={'close'} style={{color: '#f5222d'}}/>;
    },
    getBase64(fileList) {
        return fileList.length === 1 &&
            new Promise(resolve => {
                const reader = new FileReader();
                reader.addEventListener('load', () => resolve(reader.result), {passive: true});
                reader.readAsDataURL(fileList[0].originFileObj);
            });
    },
    numeral_0_0(v) {
        return numeral(v).format('0,0');
    },
    mathFloor(v) {
        return Math.floor(v);
    },
    mathCeil(v) {
        return Math.ceil(v);
    },
    mathRound(v) {
        return Math.round(v);
    },
    suffix_days(v) {
        return `${v} días`
    }
}

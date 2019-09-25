import numeral from 'numeral';
import React from 'react';
import 'moment/locale/es-do';
import moment from 'moment';
import pluralize from 'pluralize';

String.prototype.capitalize = function () {
    return this.replace(/(^|\s)([a-z])/g, function (m, p1, p2) {
        return p1 + p2.toUpperCase();
    });
};

String.prototype.plural = function () {
    return pluralize(this);
};

String.prototype.toWords = function () {
    return this.match(/[A-Z][a-z]+|[0-9]+/g).join(" ");
};

String.prototype.singular = function () {
    return pluralize(this, 1);
};

String.prototype.isPlural = function () {
    return (this.charAt(this.length - 1).toLowerCase() === 's');
};

moment.locale('es-do');

export default {
    attachment(value) {
        return <Avatar src={value} size={36}/>
    },
    units(value, {fractionDigits, unit}) {
        return `${Number(value).toFixed(fractionDigits)} ${unit}`;
    },
    wrapper(value) {
        return value;
    },
    getTZ() {
        return 'America/Mexico_City';
    },
    getRawValue(value) {
        return (value) ? value : '';
    },
    createMarkup(html) {
        return {__html: html};
    },
    hidden(value, numChars = 8, char = '&bull;') {
        const text = Array(numChars).fill(char).join('');
        return <strong dangerouslySetInnerHTML={this.createMarkup(text)}/>;
    },
    strong(value) {
        return <strong>{value}</strong>;
    },
    upperCase(value) {
        return value.toUpperCase();
    },
    kilometers(value) {
        return `${numeral(value).format('0,0')} kms`;
    },
    capitalize(value) {
        return this.getRawValue(value).capitalize();
    },
    currentYear() {
        return moment().format('YYYY');
    },
    percentage(value) {
        return `${!!value ? value : '0'} %`;
    },
    formattedDate(value, {format}) {
        return moment.tz(new Date(value), 'UTC').format(format);
    },
    formattedLocaleDate(value, {format}) {
        return moment(new Date(value)).format(format);
    },
    days(value) {
        return `${value} días`;
    },
    formattedTime(value) {
        return moment.tz(new Date(value), this.getTZ()).format('h:mm a');
    },
    time(value) {
        return new Date(moment.tz(new Date(value), this.getTZ()));
    },
    dateFromSeconds(value) {
        return new Date(moment().startOf('day').add(value, 'seconds'));
    },
    nextDay(value, {format}) {
        return moment(new Date(value)).add(1, 'day').format(format);
    },
    booleanWord(value) {
        return (value == true) ? 'Sí' : 'No';
    },
    currency(value) {
        return numeral(value).format('$0,0.00');
    },
    itemPrice(instance, {price, needPrice}) {
        return (instance[needPrice]) ? this.currency(instance[price]) : '';
    },
    mailTo(value) {
        return (<a href={`mailto:${value}`} style={{textDecoration: "none", color: "#757575"}}>{value}</a>);
    },
    avatar(value) {
        return (<Avatar src={value}/>);
    },
    coloredEnumBullet(value, {enumValues}) {
        return (
            <span style={{verticalAlign: 'middle'}}>
                <IconButton
                    tooltip={this.getRawValue(value).capitalize()}
                    tooltipPosition="top-center">
                    <CircleIcon color={enumValues[value]}/>
                </IconButton>
            </span>
        );
    },
    coloredEnumLabel(value, {enumValues}) {
        return (<strong style={{color: enumValues[value]}}>{this.getRawValue(value).capitalize()}</strong>);
    },
    colored(value, {color}) {
        return <span style={{color: color}}>{value}</span>;
    },
    coloredCircle(value) {
        return <CircleIcon color={value}/>;
    },
    errorMessage(message, cb) {
        return (
            <IconButton onTouchTap={cb}>
                {
                    (!!message && message.length > 0) ? <CircleIcon color={'#F44336'}/> :
                        <CircleIcon color={'#4CAF50'}/>
                }
            </IconButton>
        );
    },
    activeCircle(value) {
        return value ? <CircleIcon color={'#4CAF50'}/> : <CircleIcon color={'#F44336'}/>;
    },
    alertCircle(value) {
        return value ? <CircleIcon color={'#F44336'}/> : <CircleIcon color={'#4CAF50'}/>;
    },
    toWords(value) {
        let result = '';

        if (value.length > 0) {
            result = this.getRawValue(value).capitalize().match(/[A-Z][a-z]+|[0-9]+/g).join(" ");
        }

        return result;
    },
    namePrice(instance) {
        return `${instance.name} - ${this.currency(instance.price)}`;
    },
    menuItem(instance, {primaryText, secondaryText}) {
        return <MenuItem primaryText={instance[primaryText]} secondaryText={instance[secondaryText]}/>
    },
    periodItem(instance, {startDate, days}) {
        return <MenuItem
            primaryText={`${this.formattedDate(instance[startDate], {format: 'YYYY-MM-DD'})} / ${instance[days]} días`}/>
    },
    singleMenuItem(instance, {primaryText}) {
        return <MenuItem primaryText={instance[primaryText]}/>
    },
    namePriceMenuItem(instance, {name, price, needPrice}) {
        return <MenuItem primaryText={instance[name]} secondaryText={this.itemPrice(instance, {needPrice, price})}/>
    },
    namePricedMenuItem(instance, {name, price}) {
        return <MenuItem primaryText={instance[name]} secondaryText={this.currency(instance[price])}/>
    },
    checkBoxListItem(instance, {primaryText, secondaryText}) {
        return (
            <ListItem
                leftCheckbox={<Checkbox/>}
                primaryText={instance[primaryText]}
                secondaryText={instance[secondaryText]}
            />
        );
    },
    checkBoxListPriceItem(instance, {name, price, needPrice}, handeItemSelection) {
        return (
            <div>
                <ListItem
                    key={instance.id}
                    leftCheckbox={<Checkbox
                        onCheck={(event, isInputChecked) => handeItemSelection(event, isInputChecked, instance.id)}/>}
                    primaryText={instance[name]}
                    secondaryText={this.itemPrice(instance, {needPrice, price})}/>
                <Divider inset={true}/>
            </div>
        );
    },
    listPriceItem(instance, {name, price, needPrice}) {
        return (
            <ListItem
                key={instance.id}
                primaryText={instance[name]}
                secondaryText={this.itemPrice(instance, {needPrice, price})}
                disabled={true}
                style={{paddingTop: 4, paddingBottom: 4}}/>
        );
    },
    listItem(instance, {primaryText, secondaryText}) {
        return (
            <ListItem
                key={instance.id}
                primaryText={instance[primaryText]}
                secondaryText={instance[secondaryText]}
                disabled={true}
                style={{paddingTop: 4, paddingBottom: 4}}/>
        );
    },
    fullName(instance, {firstName, lastName}) {
        return (
            <span>
                <strong>{instance[firstName]}</strong>
                {instance[lastName]}
            </span>
        );
    },
    profileFullName(profile) {
        return (typeof profile != 'undefined') ? `${profile.firstName.capitalize()} ${profile.lastName.capitalize()}` : 'Sin perfil';
    },
    fieldValue(modelName, fieldName, printAs, prefix = '') {
        let value = `${prefix}${modelName}.${fieldName}`;

        if (printAs) {
            const args = (printAs.args) ? `, ${JSON.stringify(printAs.args)}` : '';
            value = `helpers.${printAs.helper}(${prefix}${modelName}.${fieldName}${args})`;
        }

        return value;
    },
    fieldViewValue(viewName, modelName, fieldName, printAs, prefix = '') {
        let value = `${viewName}.${prefix}${modelName}_${fieldName}`;

        if (printAs) {
            const args = (printAs.args) ? `, ${JSON.stringify(printAs.args)}` : '';
            value = `helpers.${printAs.helper}(${viewName}.${prefix}${modelName}_${fieldName}${args})`;
        }

        return value;
    },
    instanceValue(model, modelName) {
        let result = `${modelName}.id`;
        const printAs = model.printAs;

        if (printAs) {
            const args = (printAs.args) ? `, ${JSON.stringify(printAs.args)}` : '';
            result = `helpers.${printAs.helper}(${modelName}${args})`;
        }

        return result;
    },
    instanceCheckboxListItem(model, modelName) {
        let result = `${modelName}.id`;
        const printAs = model.printers.checkboxListItem;

        if (printAs) {
            const args = (printAs.args) ? `, ${JSON.stringify(printAs.args)}` : '';
            result = `helpers.${printAs.helper}(${modelName}${args}, this.handle${modelName.capitalize()}Selection)`;
        }

        return result;
    },
    instanceListItem(model, modelName) {
        let result = `${modelName}.id`;
        const printAs = model.printers.listItem;

        if (printAs) {
            const args = (printAs.args) ? `, ${JSON.stringify(printAs.args)}` : '';
            result = `helpers.${printAs.helper}(${modelName}${args})`;
        }

        return result;
    },
    onDate(value) {
        return {
            $and: [
                {$gte: moment(new Date(value)).format('YYYY-MM-DD')},
                {$lt: moment(new Date(value)).add(1, 'day').format('YYYY-MM-DD')}
            ]
        };
    },
    printFirstN(value, {n}) {
        return `${value.substring(0, n)} ...`;
    }
}

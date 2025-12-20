const currencyFormat = (number, code, locale) => {
    const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: code,
        currencyDisplay: 'symbol',
    });
    return formatter.format(number);
};
export default currencyFormat;

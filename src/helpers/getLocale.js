const getLocale = () => {
    /*  let locale: string
  
    if (Array.isArray(navigator.languages) && navigator.languages.length >= 1) {
      locale = navigator.languages[0]
    } else {
      locale = navigator.language
    }*/
    return navigator.language;
};
export default getLocale;

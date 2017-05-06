import enMessage from './en-US.messages';

export default Object.keys(enMessage).reduce((acc, val) => ({
    ...acc,
    [val]: val,
}), {});

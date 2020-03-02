export class Config {
    public iconPath = '';
    public featureSwitches: any = {};
}

const config = new Config();
export default (() => {
    return config;
})();

'use strict';

const dotenv = require('dotenv');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
const LocalizedFormat = require('dayjs/plugin/localizedFormat');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

const dotenv__default = /*#__PURE__*/_interopDefaultLegacy(dotenv);
const axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);
const fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
const path__default = /*#__PURE__*/_interopDefaultLegacy(path);
const YAML__default = /*#__PURE__*/_interopDefaultLegacy(YAML);
const dayjs__default = /*#__PURE__*/_interopDefaultLegacy(dayjs);
const duration__default = /*#__PURE__*/_interopDefaultLegacy(duration);
const LocalizedFormat__default = /*#__PURE__*/_interopDefaultLegacy(LocalizedFormat);

dotenv__default.config();
const { TIAN_API_KEY } = process.env;
const instance = axios__default.create({
  withCredentials: true,
  timeout: 3e4
});
instance.interceptors.response.use((response) => {
  const res = response.data;
  if (res.code === 200)
    return res.newslist;
  return void 0;
}, (error) => {
  console.log(`err${error}`);
});
const request = (config, options) => {
  if (typeof config === "string") {
    if (!options) {
      return instance.request({
        url: config
      });
    } else {
      return instance.request({
        url: config,
        ...options
      });
    }
  } else {
    return instance.request(config);
  }
};
function getTian(config, options) {
  return request({ ...config, params: { ...config.params || {}, key: TIAN_API_KEY }, method: "GET" }, options);
}

class API {
  constructor(key) {
    this.key = key || "";
  }
  getKey() {
    return this.key;
  }
  async getWeather(city_name) {
    const res = await getTian({ url: "http://api.tianapi.com/tianqi/index" /* weather */, params: { city: city_name } });
    return res?.[0];
  }
  async getDailyBriefing() {
    const res = await getTian({ url: "http://api.tianapi.com/bulletin/index" /* dailyBriefing */ });
    return res;
  }
  async getTianTopNews() {
    const res = await getTian({ url: "http://api.tianapi.com/topnews/index" /* topNews */ });
    return res;
  }
  async getSongLyrics() {
    const res = await getTian({ url: "http://api.tianapi.com/zmsc/index" /* songLyrics */ });
    return res?.[0];
  }
  async getDayEnglish() {
    const res = await getTian({ url: "http://api.tianapi.com/everyday/index" /* dayEnglish */ });
    return res?.[0];
  }
  async getOneMagazines() {
    const res = await getTian({ url: "http://api.tianapi.com/one/index" /* oneMagazines */ });
    return res?.[0];
  }
  async getStorybook() {
    const res = await getTian({ url: "http://api.tianapi.com/story/index" /* storybook */ });
    return res?.[0];
  }
  async getNetEaseCloud() {
    const res = await getTian({ url: "http://api.tianapi.com/hotreview/index" /* netEaseCloud */ });
    return res?.[0];
  }
  async getLunarDate(date) {
    const res = await getTian({ url: "http://api.tianapi.com/lunar/index" /* lunarDate */, params: { date } });
    return res?.[0];
  }
  async getSaylove() {
    const res = await getTian({ url: "http://api.tianapi.com/saylove/index" /* saylove */ });
    return res?.[0];
  }
  async getCaihongpi() {
    const res = await getTian({ url: "http://api.tianapi.com/caihongpi/index" /* caihongpi */ });
    return res?.[0];
  }
  async getJoke(num = 6) {
    const res = await getTian({ url: "http://api.tianapi.com/joke/index" /* joke */, params: { num } });
    return res;
  }
  async getOneWord() {
    try {
      const response = await axios__default("https://v1.hitokoto.cn/?encode=json" /* oneWord */, { timeout: 3e4 });
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getNBANews() {
    const res = await getTian({ url: "http://api.tianapi.com/nba/index" /* NBANews */, params: { num: 10 } });
    return res || [];
  }
}
const API$1 = new API();

const getConfig = () => {
  console.log("\u914D\u7F6E\u6587\u4EF6\u8DEF\u5F84\uFF1A", path__default.resolve(process.cwd(), "./config.yml"));
  const file = fs__default.readFileSync(path__default.resolve(process.cwd(), "./config.yml"), "utf8");
  console.log("\u914D\u7F6E\u6587\u4EF6:", YAML__default.parse(file));
  return YAML__default.parse(file);
};

async function getToken({ id, secret }) {
  const BASE_URL = "https://qyapi.weixin.qq.com";
  try {
    const response = await axios__default({
      url: `${BASE_URL}/cgi-bin/gettoken?corpid=${id}&corpsecret=${secret}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data.access_token;
  } catch (error) {
    console.log(error);
    return "";
  }
}

const BASE_URL = "https://qyapi.weixin.qq.com";
const postMsg = async (accessToken, config) => {
  const response = await axios__default({
    url: `${BASE_URL}/cgi-bin/message/send?access_token=${accessToken}`,
    method: "POST",
    data: {
      touser: config.touser || "@all",
      ...config
    }
  });
  return response.data;
};

dotenv__default.config();
const { WX_COMPANY_ID, WX_APP_ID, WX_APP_SECRET } = process.env;
console.log({ WX_COMPANY_ID, WX_APP_ID, WX_APP_SECRET });
async function wxNotify(config) {
  try {
    const accessToken = await getToken({
      id: WX_COMPANY_ID,
      secret: WX_APP_SECRET
    });
    console.log(accessToken);
    const defaultConfig = {
      msgtype: "text",
      agentid: WX_APP_ID,
      ...config
    };
    const option = { ...defaultConfig };
    const res = await postMsg(accessToken, option);
    console.log("wx:\u4FE1\u606F\u53D1\u9001\u6210\u529F\uFF01", res);
    return true;
  } catch (error) {
    console.log("wx:\u4FE1\u606F\u53D1\u9001\u5931\u8D25\uFF01", error);
    return false;
  }
}

const eText = [
  "I Love You..\u3006(\u30FB\u2200\u30FB\uFF0A)",
  "Chocolate!( \u30FB\u2200\u30FB)\u3063\u25A0",
  "(\u273F\uFF65\u03C9\uFF65)/\u2709(//\u2207//)",
  "(\u25CE_\u25CE;)",
  "\u256E(\u256F3\u2570)\u256D",
  "(\u3063 \u032F -\uFF61)",
  "( \xB4\uFF65\u03C9\uFF65)\uFF89(._.`)",
  "\u0669( \xB4\uFE36` )( \xB4\uFE36` )\u06F6",
  "\u0669(*\u04E6)\u0648",
  "\u30FE\u30FE( \u02D8 \xB3\u02D8\u4EBA)\u30FE",
  "*:\u0B90\u0669(\u0E51\xB4\u1D55`)\u06F6\u0B90:*",
  "(\u3002\uFF3F \u3002\uFF09 \u270E\uFF3F",
  "(\u0E51\u2579\u30EE\u2579\u0E51)\uFF89",
  "\uFEFF\u03B5\u2261\u0669(\u0E51&gt;\u2083&lt;)\u06F6",
  ...[
    "( *\uFE3E\u25BD\uFE3E)",
    "( *\u2032\u0434)/o(_ _)ozzZZ\u2026",
    "\u0B87w\u0B87",
    "(\u2032\u25BD`\u0283\u2661\u01AA)",
    "\u208D\u208D (\u0328\u0321 \u203E\u15E3\u203E )\u0327\u0322 \u208E\u208E",
    "\xB4\u0348 \u1D55 `\u0348",
    "\u02C3\u1DC4\u0323\u0323\u0325\u2313\u02C2\u1DC5\u0323\u0323\u0325",
    "(\uA20D\uFE43 \uA20D)",
    "\u0669(\u0E5B \u02D8 \xB3\u02D8)\u06F6\u2665",
    "(\u0283\u01AA \u02D8 \xB3\u02D8)",
    "\uA20D .\u032E \uA20D",
    "~\u10BA(\u25CF\u10E2\u25CF)\u10C2~",
    "\uFF08\\#-_-)\\\u252F\u2501\u252F",
    "\u0669\u0361[\u0E4F\u032F\u0361\u0E4F]"
  ],
  ...[
    "( \uFF3F \uFF3F)\u30CE\uFF5C",
    " (\uFF40\uFF65\u0434\uFF65\u2032)",
    "\u0CED(\u02F5\u02C9\u0334\u0352\uA1F4\u02C9\u0334\u0352\u02F5)\u0C68",
    "\u256E(\uFE40_\uFE40\u201D)\u256D",
    "(\u2032\u0434\uFF40\u03C3)\u03C3",
    "(`\uFF65\u03C9\uFF65\u2032)\u309E",
    "(\u03C3\uFF40\uFF65\u03C9\uFF65\u2032)\u03C3",
    "\u30FE(\xB4 _ ` )\u0E07\u207D'-'\u207E",
    "\u0B18(\u0A6D\u02CA\u1D55\u02CB)\u0A6D* \u0A48\u2729",
    "(\u0E51\u203E \uA1F4 \u203E\u0E51)",
    "(\u2022\u0300\u1D17\u2022\u0301)\u0648 \u0311\u0311",
    "\u057E'\u1D17' \u056B",
    "\u30FE\uFF08\u2032\u25BD\uFF40*\uFF09\u309D",
    "\uFF08\u25CE_x\uFF09"
  ],
  ...[
    "o\uFF08\u2032\u76CA`\uFF09o",
    "(\u3000/O\uFF40\uFF09",
    "( \u159B \u032B \u159B )\u0283)",
    "(\u0E51\u02D8 \u02D8\u0E51)",
    "\u02C3\u0336\u0348",
    "\u0B18(\u0A6D\u02CA\uA4B3\u200B\u02CB)\u0A6D\u2727",
    "(\u0E07 \u0E37\u25BF \u0E37)\u0E27		",
    "(\u201E\u0CA1\u03C9\u0CA1\u201E)",
    "\u2764 (\u0254\u02C6\u0437(\u02C6\u2323\u02C6c)",
    "\u250F\u251B\u5893\u2517\u2513...(((m -__-)m",
    "(\u0E51\u0150\u0434\u0150)b",
    "\u027F(\uFF61\uFF65\u025C\uFF65)\u027E\u24CC\u24D7\u24D0\u24E3\uFF1F",
    "(\uFF9F\u22BF\uFF9F)\uFF82",
    "=\u035F\u035F\u035E\u035E=\u035F\u035F\u035E\u035E(\u25CF\u2070\uA20A\u2070\u25CF |||)"
  ],
  ...[
    "!!!!=\u035E\u035F\u035F\u035E(\u0E51\xF2\u25CA\xF3 \uFF89)\uFF89",
    "!! (\u2022' '\u2022 \u06F6)\u06F6",
    "\uFF08\uFF40\u3078\xB4\uFF09",
    "\uFF08\u22670\u2266\uFF09",
    "(\u2606\u25BD\u2606)",
    "(/0\uFFE3)o",
    "(///\uFFE3\u76BF\uFFE3)\u25CB\uFF5E",
    "\u2727*\uFF61\u0669(\u02CA\u03C9\u02CB*)\u0648\u2727*\uFF61",
    "\u0669(\u2022\u0324\u0300\u1D55\u2022\u0324\u0301\u0E51)\u1D52\u1D4F\u1D4E\u1D4E\u1D4E\u1D4E",
    "(\u0E51\u2022\u0300\u3142\u2022\u0301)\u0648\u2727",
    "\u252C\u2014\u252C \u30CE( ' - '\u30CE)",
    "(\u0E51\u2022\u0300\u3141\u2022\u0301\u0E05\u2727",
    "(/\u03C9\uFF3C)",
    "...(\uFF61\u2022\u02C7\u2038\u02C7\u2022\uFF61) ..."
  ],
  ...[
    "(\xB4\u2207\uFF89\u2018*)\u30CE",
    "(\u0E51&gt;\u0602&lt;\u0E51\uFF09",
    "\u0E05( \u0333\u2022 \u25E1 \u2022 \u0333)\u0E05",
    "\u30FE(\u25CD\xB0\u2207\xB0\u25CD)\uFF89\uFF9E",
    "\u0E05\u055E\u2022\uFECC\u2022\u055E\u0E05",
    "( \uFF9F\u0434\uFF9F)\u3064Bye",
    "(o\u2256\u25E1\u2256)",
    "(\u203E\u25E1\u25DD)",
    "\u03B5 = = (\u3065\u2032\u25BD`)\u3065",
    "\u03B5(\u252C\u252C\uFE4F\u252C\u252C)3",
    "( \uFE41 \uFE41 ) ~\u2192",
    "_\u3006(\xB4\u0414\uFF40 )",
    "|_\u30FB)",
    "|\uFF65\u03C9\uFF65\uFF40)"
  ],
  ...[
    "\uA242 (\u0E51\xAF\u0A0A\xAF)\u03C3",
    "\u0E05( \u0333\u2022 \u25E1 \u2022 \u0333)\u0E05",
    "(\uFF61\uFF65\u03C9\uFF65\uFF61)\uFF89\u2661",
    "( \xB4\u25D4\u2038\u25D4`)",
    "(\u0E51&gt;\u0602&lt;\u0E51\uFF09",
    "\u2014\u25CF\u25CB\u25CE-",
    "\u2014\u2282ZZZ\u2283",
    "(=\uFF34\u30A7\uFF34=)",
    "(\uFF03\uFF40\u0434\xB4)\uFF89",
    "\u30FD(\uFF40\u2312\xB4\u30E1)\u30CE",
    "*.\u3002(\u0E51\uFF65\u2200\uFF65\u0E51)*.\u3002",
    "(\u0E51\uFF65`\u25E1\xB4\uFF65\u0E51)",
    "(\u2022\u203E\u2323\u203E\u2022)",
    "\u02DB\u02DB\uA242 \u0CED(\u02F5\xAF\u0334\u0352\uA1F4\xAF\u0334\u0352\u02F5)\u0C68\u201D"
  ],
  ...[
    "\uFF3C_(\uFF65\u03C9\uFF65`)",
    "=\u035F\u035F\u035E\u035E=\u035F\u035F\u035E\u035E\u4E09\u2746)'\u0434\xBA);",
    "\u207D\u207D\u0B18( \u02CA\u1D55\u02CB )\u0B13\u207E\u207E",
    "(\u25DE\u2038\u25DF )",
    "(=\u0334\u0336\u0337\u0324\u0304 \u2083 =\u0334\u0336\u0337\u0324\u0304)\u2661",
    ":(\u2044 \u2044\u1D52\u0336\u0336\u0337\u0301\u2044\u26B0\u2044\u1D52\u0336\u0336\u0337\u0300\u2044 \u2044):",
    "(\u02CA\u1D52\u0334\u0336\u0337\u0324 \uA1F4 \u1D52\u0334\u0336\u0337\u0324\u02CB)",
    "(\u2229\u1D52\u0334\u0336\u0337\u0324\u2314\u1D52\u0334\u0336\u0337\u0324\u2229)",
    "_(._.)_",
    'o(#\uFFE3\u25BD\uFFE3)==O))\uFFE3\u25BD\uFFE3")o',
    "( \uFFE3 \u25BD\uFFE3)o\u256D\u256F\u2606#\u2570 _\u2500\uFE4F\u2500)\u256F",
    "(\u0CA5_\u0CA5)",
    "\u2686_\u2686",
    "\uFF08\u3002&gt;\uFE3F&lt;\uFF09_\u03B8"
  ],
  ...[
    "\uFF08/\u25BD\uFF3C\uFF09",
    "\xA7\uFF08*\uFFE3\u25BD\uFFE3*\uFF09\xA7",
    "T^T",
    "\uFF08p_-\uFF09",
    "( \u0361\xB0 \u035C\u0296 \u0361\xB0)\u256F\u2642",
    "(\u2022\u0301 . \u2022\u0300)",
    "(^\u3002^)y-.\u3002o\u25CB",
    "(\u25CF\xB0u\xB0\u25CF)\u200B \u300D",
    "\u2220( \uFF9F\u03C9\uFF9F)\uFF0F",
    "('\u03C9')( \u03B5: )(.\u03C9.)( :3 )",
    "(\u309Co\u309C(\u2606\u25CB=(-_- )",
    "\u10F0\u10F0\u10F0\u275B\u203F\u275B\u10F4\u10F4\u10F4",
    "(\u0E51\uA4AA\u0A0A\uA4AA)\u03C3",
    "\u256D(\u2299o\u2299)\u256E"
  ]
];
function randomFromArray(array = eText) {
  return array[Math.floor(Math.random() * array.length)];
}
function getWeekdayText() {
  const arr = [
    `\u{1F61B}\u5E78\u798F\u5468\u65E5\u2764\uFE0F, \u4E0D\u8981\u7126\u8651,\u79BB\u5468\u4E00\u8FD8\u6709\u5F88\u591A\u4E2A\u5C0F\u65F6`,
    `\u661F\u671F\u4E00\u{1F629}: \u6CA1\u4E8B\u6CA1\u4E8B\uFF0C\u6491\u4E00\u4E0B\u9A6C\u4E0A\u4E00\u5468\u5C31\u8FC7\u53BB\u4E86`,
    `\u661F\u671F\u4E8C\u{1F627}: \u4E24\u5929\u7ED3\u675F\u4E86\uFF0C\u5468\u4E09\u8FC7\u5B8C\u56DB\u820D\u4E94\u5165\u53C8\u662F\u4E00\u5468\uFF01`,
    `\u661F\u671F\u4E09\u{1F610}: \u8FC7\u534A\u4E86\u8FC7\u534A\u4E86\uFF01\u518D\u575A\u6301\u4E0B\u9A6C\u4E0A\u660E\u5929\u8FC7\u5B8C\u5C31\u662F\u5468\u4E94\uFF01`,
    `\u{1F525}\u{1F414}\u{1F414}\u{1F525} KFC Fucking Crazy Thursday Vme50!!!\u4E00\u5468\u7EC8\u4E8E\u5FEB\u8FC7\u53BB\u4E86\uFF01\u633A\u4F4F\uFF01`,
    `\u{1F60F}\u5468\u4E94\uFF01\uFF01\uFF01, \u60F3\u60F3\u665A\u4E0A\u51C6\u5907\u5403\u70B9\u5565~`,
    `\u{1F917}\u5FEB\u4E50\u5468\u516D\u2764\uFE0F, \u5F00\u5F00\u5FC3\u5FC3\u7761\u4E2A\u597D\u89C9\uFF01`
  ];
  const weekday = dayjs__default().day();
  return arr[weekday];
}
function getRandomName() {
  const arr = ["\u81ED\u8001\u5A46", "\u4F73\u732A\u{1F437}", "\u{1F437}\u{1F437}\u{1F437}", "\u8001\u5A46\u5927\u4EBA", "\u5C0F\u91CE\u540C\u5B66", "\u61A8\u6279\u8001\u5A46", "\u5C0F\u5B9D\u8D1D"];
  return arr[Math.floor(Math.random() * arr.length)];
}

const textTemplate = (data) => {
  const { caiHongpi, sayLove, songLyrics, oneMagazines, netEaseCloud, oneWord, dayEnglish } = data;
  let text = `\u65E9\u5B89\u5440\uFF0C\u6211\u53EF\u7231\u7684${getRandomName()}
`;
  text += `
${getWeekdayText()}
`;
  if (caiHongpi) {
    text += `
${caiHongpi.content}
`;
  }
  if (sayLove) {
    text += `
${sayLove.content}
`;
  }
  if (netEaseCloud) {
    text += `
\u300E\u7F51\u6613\u4E91\u97F3\u4E50\u70ED\u8BC4\u300F${netEaseCloud.content}\u2014\u2014${netEaseCloud.source}
`;
  }
  if (oneWord) {
    text += `
\u300E\u4E00\u8A00\u300F${oneWord.hitokoto}
`;
  }
  if (dayEnglish) {
    text += `
\u300E\u6BCF\u65E5\u82F1\u8BED\u300F${dayEnglish.content}`;
  }
  return {
    msgtype: "text",
    text: {
      content: text
    }
  };
};

dayjs__default.extend(duration__default);
dayjs__default.extend(LocalizedFormat__default);

const calendar = {
  lunarInfo: [
    19416,
    19168,
    42352,
    21717,
    53856,
    55632,
    91476,
    22176,
    39632,
    21970,
    19168,
    42422,
    42192,
    53840,
    119381,
    46400,
    54944,
    44450,
    38320,
    84343,
    18800,
    42160,
    46261,
    27216,
    27968,
    109396,
    11104,
    38256,
    21234,
    18800,
    25958,
    54432,
    59984,
    92821,
    23248,
    11104,
    100067,
    37600,
    116951,
    51536,
    54432,
    120998,
    46416,
    22176,
    107956,
    9680,
    37584,
    53938,
    43344,
    46423,
    27808,
    46416,
    86869,
    19872,
    42416,
    83315,
    21168,
    43432,
    59728,
    27296,
    44710,
    43856,
    19296,
    43748,
    42352,
    21088,
    62051,
    55632,
    23383,
    22176,
    38608,
    19925,
    19152,
    42192,
    54484,
    53840,
    54616,
    46400,
    46752,
    103846,
    38320,
    18864,
    43380,
    42160,
    45690,
    27216,
    27968,
    44870,
    43872,
    38256,
    19189,
    18800,
    25776,
    29859,
    59984,
    27480,
    23232,
    43872,
    38613,
    37600,
    51552,
    55636,
    54432,
    55888,
    30034,
    22176,
    43959,
    9680,
    37584,
    51893,
    43344,
    46240,
    47780,
    44368,
    21977,
    19360,
    42416,
    86390,
    21168,
    43312,
    31060,
    27296,
    44368,
    23378,
    19296,
    42726,
    42208,
    53856,
    60005,
    54576,
    23200,
    30371,
    38608,
    19195,
    19152,
    42192,
    118966,
    53840,
    54560,
    56645,
    46496,
    22224,
    21938,
    18864,
    42359,
    42160,
    43600,
    111189,
    27936,
    44448,
    84835,
    37744,
    18936,
    18800,
    25776,
    92326,
    59984,
    27424,
    108228,
    43744,
    37600,
    53987,
    51552,
    54615,
    54432,
    55888,
    23893,
    22176,
    42704,
    21972,
    21200,
    43448,
    43344,
    46240,
    46758,
    44368,
    21920,
    43940,
    42416,
    21168,
    45683,
    26928,
    29495,
    27296,
    44368,
    84821,
    19296,
    42352,
    21732,
    53600,
    59752,
    54560,
    55968,
    92838,
    22224,
    19168,
    43476,
    41680,
    53584,
    62034,
    54560
  ],
  solarMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  Gan: ["\u7532", "\u4E59", "\u4E19", "\u4E01", "\u620A", "\u5DF1", "\u5E9A", "\u8F9B", "\u58EC", "\u7678"],
  Zhi: ["\u5B50", "\u4E11", "\u5BC5", "\u536F", "\u8FB0", "\u5DF3", "\u5348", "\u672A", "\u7533", "\u9149", "\u620C", "\u4EA5"],
  Animals: ["\u9F20", "\u725B", "\u864E", "\u5154", "\u9F99", "\u86C7", "\u9A6C", "\u7F8A", "\u7334", "\u9E21", "\u72D7", "\u732A"],
  festival: {
    "1-1": { title: "\u5143\u65E6\u8282" },
    "2-14": { title: "\u60C5\u4EBA\u8282" },
    "5-1": { title: "\u52B3\u52A8\u8282" },
    "5-4": { title: "\u9752\u5E74\u8282" },
    "6-1": { title: "\u513F\u7AE5\u8282" },
    "9-10": { title: "\u6559\u5E08\u8282" },
    "10-1": { title: "\u56FD\u5E86\u8282" },
    "12-25": { title: "\u5723\u8BDE\u8282" },
    "3-8": { title: "\u5987\u5973\u8282" },
    "3-12": { title: "\u690D\u6811\u8282" },
    "4-1": { title: "\u611A\u4EBA\u8282" },
    "5-12": { title: "\u62A4\u58EB\u8282" },
    "7-1": { title: "\u5EFA\u515A\u8282" },
    "8-1": { title: "\u5EFA\u519B\u8282" },
    "12-24": { title: "\u5E73\u5B89\u591C" }
  },
  lFestival: {
    "12-30": { title: "\u9664\u5915" },
    "1-1": { title: "\u6625\u8282" },
    "1-15": { title: "\u5143\u5BB5\u8282" },
    "2-2": { title: "\u9F99\u62AC\u5934" },
    "5-5": { title: "\u7AEF\u5348\u8282" },
    "7-7": { title: "\u4E03\u5915\u8282" },
    "7-15": { title: "\u4E2D\u5143\u8282" },
    "8-15": { title: "\u4E2D\u79CB\u8282" },
    "9-9": { title: "\u91CD\u9633\u8282" },
    "10-1": { title: "\u5BD2\u8863\u8282" },
    "10-15": { title: "\u4E0B\u5143\u8282" },
    "12-8": { title: "\u814A\u516B\u8282" },
    "12-23": { title: "\u5317\u65B9\u5C0F\u5E74" },
    "12-24": { title: "\u5357\u65B9\u5C0F\u5E74" }
  },
  getFestival() {
    return this.festival;
  },
  getLunarFestival() {
    return this.lFestival;
  },
  setFestival(param = {}) {
    this.festival = param;
  },
  setLunarFestival(param = {}) {
    this.lFestival = param;
  },
  solarTerm: ["\u5C0F\u5BD2", "\u5927\u5BD2", "\u7ACB\u6625", "\u96E8\u6C34", "\u60CA\u86F0", "\u6625\u5206", "\u6E05\u660E", "\u8C37\u96E8", "\u7ACB\u590F", "\u5C0F\u6EE1", "\u8292\u79CD", "\u590F\u81F3", "\u5C0F\u6691", "\u5927\u6691", "\u7ACB\u79CB", "\u5904\u6691", "\u767D\u9732", "\u79CB\u5206", "\u5BD2\u9732", "\u971C\u964D", "\u7ACB\u51AC", "\u5C0F\u96EA", "\u5927\u96EA", "\u51AC\u81F3"],
  sTermInfo: [
    "9778397bd097c36b0b6fc9274c91aa",
    "97b6b97bd19801ec9210c965cc920e",
    "97bcf97c3598082c95f8c965cc920f",
    "97bd0b06bdb0722c965ce1cfcc920f",
    "b027097bd097c36b0b6fc9274c91aa",
    "97b6b97bd19801ec9210c965cc920e",
    "97bcf97c359801ec95f8c965cc920f",
    "97bd0b06bdb0722c965ce1cfcc920f",
    "b027097bd097c36b0b6fc9274c91aa",
    "97b6b97bd19801ec9210c965cc920e",
    "97bcf97c359801ec95f8c965cc920f",
    "97bd0b06bdb0722c965ce1cfcc920f",
    "b027097bd097c36b0b6fc9274c91aa",
    "9778397bd19801ec9210c965cc920e",
    "97b6b97bd19801ec95f8c965cc920f",
    "97bd09801d98082c95f8e1cfcc920f",
    "97bd097bd097c36b0b6fc9210c8dc2",
    "9778397bd197c36c9210c9274c91aa",
    "97b6b97bd19801ec95f8c965cc920e",
    "97bd09801d98082c95f8e1cfcc920f",
    "97bd097bd097c36b0b6fc9210c8dc2",
    "9778397bd097c36c9210c9274c91aa",
    "97b6b97bd19801ec95f8c965cc920e",
    "97bcf97c3598082c95f8e1cfcc920f",
    "97bd097bd097c36b0b6fc9210c8dc2",
    "9778397bd097c36c9210c9274c91aa",
    "97b6b97bd19801ec9210c965cc920e",
    "97bcf97c3598082c95f8c965cc920f",
    "97bd097bd097c35b0b6fc920fb0722",
    "9778397bd097c36b0b6fc9274c91aa",
    "97b6b97bd19801ec9210c965cc920e",
    "97bcf97c3598082c95f8c965cc920f",
    "97bd097bd097c35b0b6fc920fb0722",
    "9778397bd097c36b0b6fc9274c91aa",
    "97b6b97bd19801ec9210c965cc920e",
    "97bcf97c359801ec95f8c965cc920f",
    "97bd097bd097c35b0b6fc920fb0722",
    "9778397bd097c36b0b6fc9274c91aa",
    "97b6b97bd19801ec9210c965cc920e",
    "97bcf97c359801ec95f8c965cc920f",
    "97bd097bd097c35b0b6fc920fb0722",
    "9778397bd097c36b0b6fc9274c91aa",
    "97b6b97bd19801ec9210c965cc920e",
    "97bcf97c359801ec95f8c965cc920f",
    "97bd097bd07f595b0b6fc920fb0722",
    "9778397bd097c36b0b6fc9210c8dc2",
    "9778397bd19801ec9210c9274c920e",
    "97b6b97bd19801ec95f8c965cc920f",
    "97bd07f5307f595b0b0bc920fb0722",
    "7f0e397bd097c36b0b6fc9210c8dc2",
    "9778397bd097c36c9210c9274c920e",
    "97b6b97bd19801ec95f8c965cc920f",
    "97bd07f5307f595b0b0bc920fb0722",
    "7f0e397bd097c36b0b6fc9210c8dc2",
    "9778397bd097c36c9210c9274c91aa",
    "97b6b97bd19801ec9210c965cc920e",
    "97bd07f1487f595b0b0bc920fb0722",
    "7f0e397bd097c36b0b6fc9210c8dc2",
    "9778397bd097c36b0b6fc9274c91aa",
    "97b6b97bd19801ec9210c965cc920e",
    "97bcf7f1487f595b0b0bb0b6fb0722",
    "7f0e397bd097c35b0b6fc920fb0722",
    "9778397bd097c36b0b6fc9274c91aa",
    "97b6b97bd19801ec9210c965cc920e",
    "97bcf7f1487f595b0b0bb0b6fb0722",
    "7f0e397bd097c35b0b6fc920fb0722",
    "9778397bd097c36b0b6fc9274c91aa",
    "97b6b97bd19801ec9210c965cc920e",
    "97bcf7f1487f531b0b0bb0b6fb0722",
    "7f0e397bd097c35b0b6fc920fb0722",
    "9778397bd097c36b0b6fc9274c91aa",
    "97b6b97bd19801ec9210c965cc920e",
    "97bcf7f1487f531b0b0bb0b6fb0722",
    "7f0e397bd07f595b0b6fc920fb0722",
    "9778397bd097c36b0b6fc9274c91aa",
    "97b6b97bd19801ec9210c9274c920e",
    "97bcf7f0e47f531b0b0bb0b6fb0722",
    "7f0e397bd07f595b0b0bc920fb0722",
    "9778397bd097c36b0b6fc9210c91aa",
    "97b6b97bd197c36c9210c9274c920e",
    "97bcf7f0e47f531b0b0bb0b6fb0722",
    "7f0e397bd07f595b0b0bc920fb0722",
    "9778397bd097c36b0b6fc9210c8dc2",
    "9778397bd097c36c9210c9274c920e",
    "97b6b7f0e47f531b0723b0b6fb0722",
    "7f0e37f5307f595b0b0bc920fb0722",
    "7f0e397bd097c36b0b6fc9210c8dc2",
    "9778397bd097c36b0b70c9274c91aa",
    "97b6b7f0e47f531b0723b0b6fb0721",
    "7f0e37f1487f595b0b0bb0b6fb0722",
    "7f0e397bd097c35b0b6fc9210c8dc2",
    "9778397bd097c36b0b6fc9274c91aa",
    "97b6b7f0e47f531b0723b0b6fb0721",
    "7f0e27f1487f595b0b0bb0b6fb0722",
    "7f0e397bd097c35b0b6fc920fb0722",
    "9778397bd097c36b0b6fc9274c91aa",
    "97b6b7f0e47f531b0723b0b6fb0721",
    "7f0e27f1487f531b0b0bb0b6fb0722",
    "7f0e397bd097c35b0b6fc920fb0722",
    "9778397bd097c36b0b6fc9274c91aa",
    "97b6b7f0e47f531b0723b0b6fb0721",
    "7f0e27f1487f531b0b0bb0b6fb0722",
    "7f0e397bd097c35b0b6fc920fb0722",
    "9778397bd097c36b0b6fc9274c91aa",
    "97b6b7f0e47f531b0723b0b6fb0721",
    "7f0e27f1487f531b0b0bb0b6fb0722",
    "7f0e397bd07f595b0b0bc920fb0722",
    "9778397bd097c36b0b6fc9274c91aa",
    "97b6b7f0e47f531b0723b0787b0721",
    "7f0e27f0e47f531b0b0bb0b6fb0722",
    "7f0e397bd07f595b0b0bc920fb0722",
    "9778397bd097c36b0b6fc9210c91aa",
    "97b6b7f0e47f149b0723b0787b0721",
    "7f0e27f0e47f531b0723b0b6fb0722",
    "7f0e397bd07f595b0b0bc920fb0722",
    "9778397bd097c36b0b6fc9210c8dc2",
    "977837f0e37f149b0723b0787b0721",
    "7f07e7f0e47f531b0723b0b6fb0722",
    "7f0e37f5307f595b0b0bc920fb0722",
    "7f0e397bd097c35b0b6fc9210c8dc2",
    "977837f0e37f14998082b0787b0721",
    "7f07e7f0e47f531b0723b0b6fb0721",
    "7f0e37f1487f595b0b0bb0b6fb0722",
    "7f0e397bd097c35b0b6fc9210c8dc2",
    "977837f0e37f14998082b0787b06bd",
    "7f07e7f0e47f531b0723b0b6fb0721",
    "7f0e27f1487f531b0b0bb0b6fb0722",
    "7f0e397bd097c35b0b6fc920fb0722",
    "977837f0e37f14998082b0787b06bd",
    "7f07e7f0e47f531b0723b0b6fb0721",
    "7f0e27f1487f531b0b0bb0b6fb0722",
    "7f0e397bd097c35b0b6fc920fb0722",
    "977837f0e37f14998082b0787b06bd",
    "7f07e7f0e47f531b0723b0b6fb0721",
    "7f0e27f1487f531b0b0bb0b6fb0722",
    "7f0e397bd07f595b0b0bc920fb0722",
    "977837f0e37f14998082b0787b06bd",
    "7f07e7f0e47f531b0723b0b6fb0721",
    "7f0e27f1487f531b0b0bb0b6fb0722",
    "7f0e397bd07f595b0b0bc920fb0722",
    "977837f0e37f14998082b0787b06bd",
    "7f07e7f0e47f149b0723b0787b0721",
    "7f0e27f0e47f531b0b0bb0b6fb0722",
    "7f0e397bd07f595b0b0bc920fb0722",
    "977837f0e37f14998082b0723b06bd",
    "7f07e7f0e37f149b0723b0787b0721",
    "7f0e27f0e47f531b0723b0b6fb0722",
    "7f0e397bd07f595b0b0bc920fb0722",
    "977837f0e37f14898082b0723b02d5",
    "7ec967f0e37f14998082b0787b0721",
    "7f07e7f0e47f531b0723b0b6fb0722",
    "7f0e37f1487f595b0b0bb0b6fb0722",
    "7f0e37f0e37f14898082b0723b02d5",
    "7ec967f0e37f14998082b0787b0721",
    "7f07e7f0e47f531b0723b0b6fb0722",
    "7f0e37f1487f531b0b0bb0b6fb0722",
    "7f0e37f0e37f14898082b0723b02d5",
    "7ec967f0e37f14998082b0787b06bd",
    "7f07e7f0e47f531b0723b0b6fb0721",
    "7f0e37f1487f531b0b0bb0b6fb0722",
    "7f0e37f0e37f14898082b072297c35",
    "7ec967f0e37f14998082b0787b06bd",
    "7f07e7f0e47f531b0723b0b6fb0721",
    "7f0e27f1487f531b0b0bb0b6fb0722",
    "7f0e37f0e37f14898082b072297c35",
    "7ec967f0e37f14998082b0787b06bd",
    "7f07e7f0e47f531b0723b0b6fb0721",
    "7f0e27f1487f531b0b0bb0b6fb0722",
    "7f0e37f0e366aa89801eb072297c35",
    "7ec967f0e37f14998082b0787b06bd",
    "7f07e7f0e47f149b0723b0787b0721",
    "7f0e27f1487f531b0b0bb0b6fb0722",
    "7f0e37f0e366aa89801eb072297c35",
    "7ec967f0e37f14998082b0723b06bd",
    "7f07e7f0e47f149b0723b0787b0721",
    "7f0e27f0e47f531b0723b0b6fb0722",
    "7f0e37f0e366aa89801eb072297c35",
    "7ec967f0e37f14998082b0723b06bd",
    "7f07e7f0e37f14998083b0787b0721",
    "7f0e27f0e47f531b0723b0b6fb0722",
    "7f0e37f0e366aa89801eb072297c35",
    "7ec967f0e37f14898082b0723b02d5",
    "7f07e7f0e37f14998082b0787b0721",
    "7f07e7f0e47f531b0723b0b6fb0722",
    "7f0e36665b66aa89801e9808297c35",
    "665f67f0e37f14898082b0723b02d5",
    "7ec967f0e37f14998082b0787b0721",
    "7f07e7f0e47f531b0723b0b6fb0722",
    "7f0e36665b66a449801e9808297c35",
    "665f67f0e37f14898082b0723b02d5",
    "7ec967f0e37f14998082b0787b06bd",
    "7f07e7f0e47f531b0723b0b6fb0721",
    "7f0e36665b66a449801e9808297c35",
    "665f67f0e37f14898082b072297c35",
    "7ec967f0e37f14998082b0787b06bd",
    "7f07e7f0e47f531b0723b0b6fb0721",
    "7f0e26665b66a449801e9808297c35",
    "665f67f0e37f1489801eb072297c35",
    "7ec967f0e37f14998082b0787b06bd",
    "7f07e7f0e47f531b0723b0b6fb0721",
    "7f0e27f1487f531b0b0bb0b6fb0722"
  ],
  nStr1: ["\u65E5", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D", "\u4E03", "\u516B", "\u4E5D", "\u5341"],
  nStr2: ["\u521D", "\u5341", "\u5EFF", "\u5345"],
  nStr3: ["\u6B63", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D", "\u4E03", "\u516B", "\u4E5D", "\u5341", "\u51AC", "\u814A"],
  lYearDays: function(y) {
    let i, sum = 348;
    for (i = 32768; i > 8; i >>= 1) {
      sum += this.lunarInfo[y - 1900] & i ? 1 : 0;
    }
    return sum + this.leapDays(y);
  },
  leapMonth: function(y) {
    return this.lunarInfo[y - 1900] & 15;
  },
  leapDays: function(y) {
    if (this.leapMonth(y)) {
      return this.lunarInfo[y - 1900] & 65536 ? 30 : 29;
    }
    return 0;
  },
  monthDays: function(y, m) {
    if (m > 12 || m < 1) {
      return -1;
    }
    return this.lunarInfo[y - 1900] & 65536 >> m ? 30 : 29;
  },
  solarDays: function(y, m) {
    if (m > 12 || m < 1) {
      return -1;
    }
    const ms = m - 1;
    if (ms === 1) {
      return y % 4 === 0 && y % 100 !== 0 || y % 400 === 0 ? 29 : 28;
    } else {
      return this.solarMonth[ms];
    }
  },
  toGanZhiYear: function(lYear) {
    var ganKey = (lYear - 3) % 10;
    var zhiKey = (lYear - 3) % 12;
    if (ganKey === 0)
      ganKey = 10;
    if (zhiKey === 0)
      zhiKey = 12;
    return this.Gan[ganKey - 1] + this.Zhi[zhiKey - 1];
  },
  toAstro: function(cMonth, cDay) {
    const s = "\u9B54\u7FAF\u6C34\u74F6\u53CC\u9C7C\u767D\u7F8A\u91D1\u725B\u53CC\u5B50\u5DE8\u87F9\u72EE\u5B50\u5904\u5973\u5929\u79E4\u5929\u874E\u5C04\u624B\u9B54\u7FAF";
    const arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
    return s.substr(cMonth * 2 - (cDay < arr[cMonth - 1] ? 2 : 0), 2) + "\u5EA7";
  },
  toGanZhi: function(offset) {
    return this.Gan[offset % 10] + this.Zhi[offset % 12];
  },
  getTerm: function(y, n) {
    if (y < 1900 || y > 2100 || n < 1 || n > 24) {
      return -1;
    }
    const _table = this.sTermInfo[y - 1900];
    const _calcDay = [];
    for (let index = 0; index < _table.length; index += 5) {
      const chunk = parseInt("0x" + _table.substr(index, 5)).toString();
      _calcDay.push(chunk[0], chunk.substr(1, 2), chunk[3], chunk.substr(4, 2));
    }
    return parseInt(_calcDay[n - 1]);
  },
  toChinaMonth: function(m) {
    if (m > 12 || m < 1) {
      return -1;
    }
    let s = this.nStr3[m - 1];
    s += "\u6708";
    return s;
  },
  toChinaDay: function(d) {
    let s;
    switch (d) {
      case 10:
        s = "\u521D\u5341";
        break;
      case 20:
        s = "\u4E8C\u5341";
        break;
      case 30:
        s = "\u4E09\u5341";
        break;
      default:
        s = this.nStr2[Math.floor(d / 10)];
        s += this.nStr1[d % 10];
    }
    return s;
  },
  getAnimal: function(y) {
    return this.Animals[(y - 4) % 12];
  },
  solar2lunar: function(yPara, mPara, dPara) {
    let y = parseInt(yPara);
    let m = parseInt(mPara);
    let d = parseInt(dPara);
    if (y < 1900 || y > 2100) {
      return -1;
    }
    if (y === 1900 && m === 1 && d < 31) {
      return -1;
    }
    let objDate;
    if (!y) {
      objDate = new Date();
    } else {
      objDate = new Date(y, parseInt(m) - 1, d);
    }
    let i, leap = 0, temp = 0;
    y = objDate.getFullYear();
    m = objDate.getMonth() + 1;
    d = objDate.getDate();
    let offset = (Date.UTC(objDate.getFullYear(), objDate.getMonth(), objDate.getDate()) - Date.UTC(1900, 0, 31)) / 864e5;
    for (i = 1900; i < 2101 && offset > 0; i++) {
      temp = this.lYearDays(i);
      offset -= temp;
    }
    if (offset < 0) {
      offset += temp;
      i--;
    }
    let isTodayObj = new Date(), isToday = false;
    if (isTodayObj.getFullYear() === y && isTodayObj.getMonth() + 1 === m && isTodayObj.getDate() === d) {
      isToday = true;
    }
    let nWeek = objDate.getDay(), cWeek = this.nStr1[nWeek];
    if (nWeek === 0) {
      nWeek = 7;
    }
    const year = i;
    leap = this.leapMonth(i);
    let isLeap = false;
    for (i = 1; i < 13 && offset > 0; i++) {
      if (leap > 0 && i === leap + 1 && isLeap === false) {
        --i;
        isLeap = true;
        temp = this.leapDays(year);
      } else {
        temp = this.monthDays(year, i);
      }
      if (isLeap === true && i === leap + 1) {
        isLeap = false;
      }
      offset -= temp;
    }
    if (offset === 0 && leap > 0 && i === leap + 1) {
      if (isLeap) {
        isLeap = false;
      } else {
        isLeap = true;
        --i;
      }
    }
    if (offset < 0) {
      offset += temp;
      --i;
    }
    const month = i;
    const day = offset + 1;
    const sm = m - 1;
    const gzY = this.toGanZhiYear(year);
    const firstNode = this.getTerm(y, m * 2 - 1);
    const secondNode = this.getTerm(y, m * 2);
    let gzM = this.toGanZhi((y - 1900) * 12 + m + 11);
    if (d >= firstNode) {
      gzM = this.toGanZhi((y - 1900) * 12 + m + 12);
    }
    let isTerm = false;
    let Term = null;
    if (firstNode === d) {
      isTerm = true;
      Term = this.solarTerm[m * 2 - 2];
    }
    if (secondNode === d) {
      isTerm = true;
      Term = this.solarTerm[m * 2 - 1];
    }
    const dayCyclical = Date.UTC(y, sm, 1, 0, 0, 0, 0) / 864e5 + 25567 + 10;
    const gzD = this.toGanZhi(dayCyclical + d - 1);
    const astro = this.toAstro(m, d);
    const solarDate = y + "-" + m + "-" + d;
    const lunarDate = year + "-" + month + "-" + day;
    const festival = this.festival;
    const lFestival = this.lFestival;
    const festivalDate = m + "-" + d;
    let lunarFestivalDate = month + "-" + day;
    if (month === 12 && day === 29 && this.monthDays(year, month) === 29) {
      lunarFestivalDate = "12-30";
    }
    return {
      date: solarDate,
      lunarDate,
      festival: festival[festivalDate] ? festival[festivalDate].title : null,
      lunarFestival: lFestival[lunarFestivalDate] ? lFestival[lunarFestivalDate].title : null,
      "lYear": year,
      "lMonth": month,
      "lDay": day,
      "Animal": this.getAnimal(year),
      "IMonthCn": (isLeap ? "\u95F0" : "") + this.toChinaMonth(month),
      "IDayCn": this.toChinaDay(day),
      "cYear": y,
      "cMonth": m,
      "cDay": d,
      "gzYear": gzY,
      "gzMonth": gzM,
      "gzDay": gzD,
      "isToday": isToday,
      "isLeap": isLeap,
      "nWeek": nWeek,
      "ncWeek": "\u661F\u671F" + cWeek,
      "isTerm": isTerm,
      "Term": Term,
      "astro": astro
    };
  },
  lunar2solar: function(y, m, d, isLeapMonth) {
    y = parseInt(y);
    m = parseInt(m);
    d = parseInt(d);
    isLeapMonth = !!isLeapMonth;
    const leapMonth = this.leapMonth(y);
    this.leapDays(y);
    if (isLeapMonth && leapMonth !== m) {
      return -1;
    }
    if (y === 2100 && m === 12 && d > 1 || y === 1900 && m === 1 && d < 31) {
      return -1;
    }
    const day = this.monthDays(y, m);
    let _day = day;
    if (isLeapMonth) {
      _day = this.leapDays(y, m);
    }
    if (y < 1900 || y > 2100 || d > _day) {
      return -1;
    }
    let offset = 0;
    let i;
    for (i = 1900; i < y; i++) {
      offset += this.lYearDays(i);
    }
    let leap = 0, isAdd = false;
    for (i = 1; i < m; i++) {
      leap = this.leapMonth(y);
      if (!isAdd) {
        if (leap <= i && leap > 0) {
          offset += this.leapDays(y);
          isAdd = true;
        }
      }
      offset += this.monthDays(y, i);
    }
    if (isLeapMonth) {
      offset += day;
    }
    const strap = Date.UTC(1900, 1, 30, 0, 0, 0);
    const calObj = new Date((offset + d - 31) * 864e5 + strap);
    const cY = calObj.getUTCFullYear();
    const cM = calObj.getUTCMonth() + 1;
    const cD = calObj.getUTCDate();
    return this.solar2lunar(cY, cM, cD);
  }
};
const calendar$1 = calendar;

const CONFIG$2 = getConfig().loveMsg;
const {
  birthday,
  birthday_self
} = CONFIG$2;
const year = dayjs__default().year();
function getDaysToBirthday(date = birthday) {
  const birthday_month = dayjs__default(date).month() + 1;
  const birthday_day = dayjs__default(date).date();
  const { date: _date } = calendar$1.lunar2solar(year, birthday_month, birthday_day, false);
  const duration = dayjs__default().diff(_date, "day");
  return duration < 0 ? Math.abs(duration) : 365 + duration;
}

const CONFIG$1 = getConfig().loveMsg;
const selfDuration = getDaysToBirthday(CONFIG$1.birthday_self);
const wifeDuration = getDaysToBirthday(CONFIG$1.birthday);
console.log(selfDuration, "selfDuration");
const textCardTemplate = (data) => {
  const {
    area,
    date,
    weather,
    highest,
    lowest,
    wind,
    windsc,
    humidity,
    week,
    pop,
    pcpn,
    tips,
    lunarInfo
  } = data;
  const today = `${date.replace("-", "\u5E74").replace("-", "\u6708")}\u65E5`;
  const dateLength = dayjs__default(date).diff(CONFIG$1.start_stamp, "day");
  let description = `${area} | ${today} | ${week}`;
  if (CONFIG$1.date_lunarInfo && lunarInfo) {
    const { festival, lunar_festival, jieqi, lubarmonth, lunarday } = lunarInfo;
    const festival_info = festival ? `| ${festival}` : "";
    const lunar_festival_info = lunar_festival ? `| ${lunar_festival}` : "";
    const jieqi_info = jieqi ? `| ${jieqi}` : "";
    description += ` ${festival_info}
\u519C\u5386 | ${lubarmonth}${lunarday} ${lunar_festival_info} ${jieqi_info}`;
  }
  description += `
\u4ECA\u65E5\u5929\u6C14\u72B6\u51B5\uFF1A
\u5929\u6C14\uFF1A${weather}
\u6E29\u5EA6\uFF1A${lowest} ~ ${highest}
`;
  if (weather.includes("\u96E8")) {
    description = description + `\u964D\u96E8\uFF1A${pop}% | ${pcpn}mm 
`;
  }
  if (+pop > 50) {
    description += `\u4ECA\u5929\u53EF\u80FD\u4F1A\u4E0B\u96E8,\u5C0F\u5B9D\u8D1D\u8BB0\u5F97\u5E26\u4F1E\u54E6~ 
`;
  } else if (Number(highest.replace("\u2103", "")) > 30) {
    description += `\u554A\u597D\u70ED\u597D\u70ED~, \u70ED\u6B7B\u4E86~~, \u5B9D\u8D1D\u8BB0\u5F97\u505A\u597D\u9632\u6652
`;
  }
  if (CONFIG$1.weather_tem && highest && +highest.replace("\u2103", "") <= 3) {
    description += `
\u54C8\u55BD\u54C8\u55BD~\u8FD9\u91CC\u662F\u6765\u81EA${CONFIG$1.boy_name}\u7684\u7231\u5FC3\u63D0\u9192\u54E6\uFF1A
\u4ECA\u65E5\u6700\u9AD8\u6E29\u5EA6\u4EC5\u4E3A\u{1F976} ${highest}\uFF0C\u53EF\u51B7\u53EF\u51B7\u4E86~
${CONFIG$1.girl_name}\u53EF\u8981\u6CE8\u610F\u4FDD\u6696\u54E6~
`;
  }
  description += `
    \u6E29\u99A8\u5C0Ftip: 
      ${wifeDuration !== 0 ? `\u8DDD\u79BB\u81ED\u8001\u5A46\u751F\u65E5\u8FD8\u6709${wifeDuration}\u5929` : "\u81ED\u8001\u5A46\u751F\u65E5\u5FEB\u4E50!!!\uFF01"}
      ${selfDuration !== 0 ? `\u8DDD\u79BB\u5C0F\u7334\u5B50\u751F\u65E5\u8FD8\u6709${selfDuration}\u5929` : "\u7ED9\u5C0F\u7334\u5B50\u7559\u4E0B\u4E00\u4E2A\u96BE\u5FD8\u7684\u751F\u65E5\u5427!"}
  `;
  description += `
  [ \u70B9\u6211\u6709\u60CA\u559C ] \u{1F49A} \u{1F496} \u{1F437} \u{1F412}${randomFromArray()} `;
  const title = `\u8FD9\u662F\u6211\u4EEC\u76F8\u8BC6\u7684\u7B2C ${dateLength} \u5929`;
  return {
    msgtype: "textcard",
    textcard: {
      title,
      description,
      url: `${CONFIG$1.card_url}`,
      btntxt: `By${CONFIG$1.boy_name}`
    }
  };
};

const CONFIG = getConfig().loveMsg;
const goodWord = async () => {
  try {
    const dataSource = await Promise.allSettled([
      API$1.getSaylove(),
      API$1.getCaihongpi(),
      API$1.getOneWord(),
      API$1.getSongLyrics(),
      API$1.getOneMagazines(),
      API$1.getNetEaseCloud(),
      API$1.getDayEnglish()
    ]);
    console.log("dataSource", dataSource);
    const [sayLove, caiHongpi, oneWord, songLyrics, oneMagazines, netEaseCloud, dayEnglish] = dataSource.map((n) => n.status === "fulfilled" ? n.value : null);
    const data = {
      sayLove,
      caiHongpi,
      oneWord,
      songLyrics,
      oneMagazines,
      netEaseCloud,
      dayEnglish
    };
    const template = textTemplate(data);
    console.log("goodWord", template);
    wxNotify(template);
  } catch (error) {
    console.log("goodWord:err", error);
  }
};
const weatherInfo = async () => {
  try {
    const weather = await API$1.getWeather(CONFIG.city_name);
    if (weather) {
      const lunarInfo = await API$1.getLunarDate(weather.date);
      const template = textCardTemplate({ ...weather, lunarInfo });
      console.log("template", template);
      await wxNotify(template);
    }
  } catch (error) {
    console.log("weatherInfo:err", error);
  }
};
const goodMorning$1 = async () => {
  await weatherInfo();
  await goodWord();
};

const goodAfternoon$1 = async () => {
  let res = await API$1.getJoke();
  res = res.slice(0, 2);
  let text = "\u4ECA\u65E5\u4EFD\u5348\u5B89\u6765\u55BD:\n";
  text += `
\u8BF7\u6B23\u8D4F\u4EE5\u4E0B\u96F7\u4EBA\u7B11\u8BDD\u{1F61D}
`;
  text += `
${res.map((n) => `\u300E${n.title}\u300F${n.content}`).join("\n\n")}`;
  const template = {
    msgtype: "text",
    text: {
      content: text
    }
  };
  await wxNotify(template);
};

const newsTemplate = (list) => {
  let articles = [];
  if (list && Array.isArray(list)) {
    articles = list.map((n) => {
      return {
        title: n.title,
        description: n.description,
        url: n.url,
        picurl: n.picUrl
      };
    });
  }
  console.log(JSON.stringify(articles, null, 2));
  return {
    msgtype: "news",
    news: {
      articles
    }
  };
};

const getStory = async () => {
  const res = await API$1.getStorybook();
  const template = {
    msgtype: "text",
    text: {
      content: `\u7ED9\u81ED\u8001\u5A46\u7684\u4ECA\u65E5\u4EFD\u7761\u524D\u665A\u5B89\u6545\u4E8B\u6765\u55BD\uFF1A
\u{1F311}\u{1F312}\u{1F313}\u{1F314}\u{1F315}\u{1F31D}\u{1F61B}

\u300E${res.title}\u300F
${res.content}`
    }
  };
  await wxNotify(template);
};
const goodEvening$1 = async () => {
  await getStory();
};

const getNbaNews$1 = async () => {
  const result = await API$1.getNBANews();
  const template = newsTemplate(result.slice(0, 8));
  await wxNotify({
    ...template
  });
};

dotenv__default.config();
process.env;
const LoveMsg = {
  goodAfternoon: goodAfternoon$1,
  goodEvening: goodEvening$1,
  goodMorning: goodMorning$1,
  getNbaNews: getNbaNews$1
};

const { goodAfternoon, goodEvening, goodMorning, getNbaNews } = LoveMsg;
const schedule = require("node-schedule");
dotenv__default.config();
schedule.scheduleJob("1 30 8 * * *", () => {
  goodMorning();
});
schedule.scheduleJob("1 1 18 * * *", () => {
  goodAfternoon();
});
schedule.scheduleJob("1 30 23 * * *", () => {
  goodEvening();
});

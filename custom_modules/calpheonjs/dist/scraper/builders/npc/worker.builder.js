"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Worker = void 0;
var AppUtils = __importStar(require("../../../shared/utils"));
var typings_1 = require("../../../shared/typings");
var generic_builder_1 = require("../generic.builder");
var shared_1 = require("../../../shared");
var Worker = /** @class */ (function (_super) {
    __extends(Worker, _super);
    function Worker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Worker.get = function () {
        return Worker;
    };
    Object.defineProperty(Worker, "type", {
        get: function () {
            return "worker";
        },
        enumerable: false,
        configurable: true
    });
    Worker.prototype.getUpgradesArray = function () {
        var ctx = this.cache.for('upgrades_array');
        if (!ctx.has('data')) {
            var raw = this.$('.smallertext')
                .first()
                .find('script')
                .last()
                .html();
            if (!raw)
                return ctx.set('data', []);
            return ctx.set('data', JSON.parse(raw.substr(raw.indexOf('['))));
        }
        return ctx.get('data');
    };
    Object.defineProperty(Worker.prototype, "icon", {
        get: function () {
            return this.$('img.quest_icon').attr('src');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Worker.prototype, "sellable", {
        get: function () {
            var _a;
            var matcher = new shared_1.Matcher(this._locale, (_a = {},
                _a[typings_1.App.Locales.US] = ['Sellable'],
                _a));
            var row = this.getTableRow(matcher);
            return !!(row === null || row === void 0 ? void 0 : row.childNodes.find(function (node, idx, arr) {
                if (!matcher.in(node.data))
                    return;
                var i = idx;
                while (++i < arr.length)
                    if (arr[i].tagName === 'span' && arr[i].attribs.class)
                        if (arr[i].attribs.class.indexOf('glyphicon-ok') !== -1)
                            return true;
                return false;
            }));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Worker.prototype, "max_base_stats", {
        get: function () {
            var stamina = parseInt(this.$('#work_speed')
                .parent()
                .parent()
                .parent()
                .children()
                .last()
                .text()
                .replace(/\D/g, ''));
            return {
                work_speed: parseInt(this.$('#work_speed').text()),
                movement_speed: parseInt(this.$('#move_speed').text()),
                luck: parseInt(this.$('#luck').text()),
                stamina: stamina,
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Worker.prototype, "levels", {
        get: function () {
            return this.getUpgradesArray().map(function (curr) { return ({
                exp_to_next_lvl: parseInt(curr.nextlvexp.replace(/\D/g, '')),
                sell_price: parseInt(curr.sell_price.replace(/\D/g, '')),
            }); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Worker.prototype, "growth", {
        get: function () {
            var _a, _b, _c;
            var _this = this;
            var table = this
                .$('.region_table')
                .parent()
                .find('> table')
                .toArray()[1];
            var rows = this.$(table)
                .find('td')
                .toArray();
            var find = function (matcher) {
                return _this.$(rows[rows.findIndex(function (node) {
                    return matcher.in(_this.$(node).text());
                }) + 1])
                    .text()
                    .split('~')
                    .map(function (str) { return parseFloat(str.trim()); });
            };
            return {
                work_speed: find(new shared_1.Matcher(this._locale, (_a = {},
                    _a[typings_1.App.Locales.US] = ['Work speed growth per level'],
                    _a))),
                movement_speed: find(new shared_1.Matcher(this._locale, (_b = {},
                    _b[typings_1.App.Locales.US] = ['Speed growth per level'],
                    _b))),
                luck: find(new shared_1.Matcher(this._locale, (_c = {},
                    _c[typings_1.App.Locales.US] = ['Luck growth per level'],
                    _c))),
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Worker.prototype, "obtained_from", {
        get: function () {
            var _a;
            var matcher = new shared_1.Matcher(this._locale, (_a = {},
                _a[typings_1.App.Locales.US] = ['Obtained from:'],
                _a));
            var idx = this.getBodyNodes(true)
                .findIndex(function (node) { return matcher.in(node.data); });
            if (idx === -1)
                return undefined;
            var img = this.$(this.getBodyNodes(true)[idx + 2]).find('img');
            var anchor = this.$(this.getBodyNodes(true)[idx + 10]);
            var url = anchor.attr('href');
            return {
                type: "npc",
                id: AppUtils.decomposeShortURL(url).id,
                icon: img.attr('src'),
                name: anchor.text(),
                shortUrl: url,
                scrape: this.ScrapeFactory(url),
            };
        },
        enumerable: false,
        configurable: true
    });
    Worker.prototype.build = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = [{}];
                        return [4 /*yield*/, _super.prototype.build.call(this)];
                    case 1: return [2 /*return*/, __assign.apply(void 0, [__assign.apply(void 0, _a.concat([(_b.sent())])), { sellable: this.sellable, max_base_stats: this.max_base_stats, levels: this.levels, growth: this.growth, obtained_from: this.obtained_from }])];
                }
            });
        });
    };
    return Worker;
}(generic_builder_1.Generic));
exports.Worker = Worker;

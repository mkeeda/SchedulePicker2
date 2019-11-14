import { EventMenuColor } from '../types/event';

// イベントメニューのカラー設定
export const eventMenuColor = (planName: string): EventMenuColor => {
    const eventMenuColor = {
        r: 49,
        g: 130,
        b: 220,
    };
    switch (planName) {
        // 青
        case '打合':
        case '会議':
            eventMenuColor.r = 49;
            eventMenuColor.g = 130;
            eventMenuColor.b = 220;
            break;
        // 水色
        case '来訪':
        case '取材/講演':
        case '【履歴】来訪':
            eventMenuColor.r = 87;
            eventMenuColor.g = 179;
            eventMenuColor.b = 237;
            break;
        // オレンジ
        case '出張':
        case 'ウルトラワーク':
            eventMenuColor.r = 239;
            eventMenuColor.g = 146;
            eventMenuColor.b = 1;
            break;
        // 赤
        case '副業':
        case '複業':
        case '休み':
            eventMenuColor.r = 244;
            eventMenuColor.g = 72;
            eventMenuColor.b = 72;
            break;
        // ピンク
        case '往訪':
        case '【履歴】往訪':
            eventMenuColor.r = 241;
            eventMenuColor.g = 148;
            eventMenuColor.b = 167;
            break;
        // 紫
        case '面接':
        case 'フェア':
            eventMenuColor.r = 181;
            eventMenuColor.g = 146;
            eventMenuColor.b = 216;
            break;
        // 茶色
        case '勉強会':
        case 'タスク':
            eventMenuColor.r = 185;
            eventMenuColor.g = 153;
            eventMenuColor.b = 118;
            break;
        // グレー
        case '説明会':
        case 'セミナー':
        case 'その他':
            eventMenuColor.r = 153;
            eventMenuColor.g = 153;
            eventMenuColor.b = 153;
            break;
        // 黄緑
        case '終日':
            eventMenuColor.r = 50;
            eventMenuColor.g = 205;
            eventMenuColor.b = 50;
            break;
    }
    return eventMenuColor;
};

import { MacroParser, Macro } from './macro_parser';

describe('parse macros', () => {
    const messages = [
        '$imgplayer=1,2',
        '$imgyesno=4,5',
        'this is message!',
    ];
    const results = messages.map(message => new MacroParser(message).parse());

    it('check imgplayer', () => {
        expect(results[0]).toEqual(new Macro('imgplayer', ['1', '2']));
    });
    it('check imgyesno', () => {
        expect(results[1]).toEqual(new Macro('imgyesno', ['4', '5']));
    });
    it('check message', () => {
        expect(results[2]).toEqual('this is message!');
    });
});

describe('parse imgplayer', () => {
    it('success', () => {
        const message = '$imgplayer=1,2';
        expect(new MacroParser(message).parse()).toEqual(new Macro('imgplayer', ['1', '2']));
    });
    it('failure', () => {
        expect(new MacroParser('$imgplayer=1').parse()).toEqual("");
    });
});

describe('parse imgyesno', () => {
    it('success', () => {
        const message = '$imgyesno=1,2';
        expect(new MacroParser(message).parse()).toEqual(new Macro('imgyesno', ['1', '2']));
    });
    it('failure', () => {
        const message = '$imgyesno=1';
        expect(new MacroParser(message).parse()).toEqual("");
    });
});

describe('parse hpmax', () => {
    it('success', () => {
        const message = '$hpmax=1';
        expect(new MacroParser(message).parse()).toEqual(new Macro('hpmax', ['1']));
    });
    it('failure', () => {
        const message = '$hpmax=hoge';
        expect(new MacroParser(message).parse()).toEqual("");
    });
});

describe('parse save', () => {
    it('success', () => {
        let message = '$save=0';
        expect(new MacroParser(message).parse()).toEqual(new Macro('save', ['0']));
        message = '$save=1';
        expect(new MacroParser(message).parse()).toEqual(new Macro('save', ['1']));
        // 想定されていない値でもパースは成功する (値のバリデーションはアプリケーション側の責務)
        message = '$save=2';
        expect(new MacroParser(message).parse()).toEqual(new Macro('save', ['2']));
    });
});

describe('parse item', () => {
    it('success', () => {
        let message = '$item=0,5';
        expect(new MacroParser(message).parse()).toEqual(new Macro('item', ['0', '5']));
        message = '$item=11,90';
        expect(new MacroParser(message).parse()).toEqual(new Macro('item', ['11', '90']));
        message = '$item=23,5';
        expect(new MacroParser(message).parse()).toEqual(new Macro('item', ['23', '5']));
    });
});

describe('parse default', () => {
    const name = 'default';
    it('success', () => {
        let message = '$default=0';
        expect(new MacroParser(`$${name}=0`).parse()).toEqual(new Macro(name, ['0']));
        message = '$default=1';
        expect(new MacroParser(`$${name}=1`).parse()).toEqual(new Macro(name, ['1']));
        message = '$default=2';
        expect(new MacroParser(`$${name}=2`).parse()).toEqual(new Macro(name, ['2']));
    });
    it('failure', () => {
        expect(new MacroParser(`$${name}=2,`).parse()).toEqual("");
    });
});

describe('parse oldmap', () => {
    const name = 'oldmap';
    it('success', () => {
        expect(new MacroParser(`$${name}=0`).parse()).toEqual(new Macro(name, ['0']));
        expect(new MacroParser(`$${name}=1`).parse()).toEqual(new Macro(name, ['1']));
        expect(new MacroParser(`$${name}=2`).parse()).toEqual(new Macro(name, ['2']));
    });
    it('failure', () => {
        expect(new MacroParser(`$${name}=2,3`).parse()).toEqual("");
    });
});

describe('parse parts', () => {
    const name = 'parts';
    it('success', () => {
        expect(new MacroParser(`$${name}=4,10`).parse()).toEqual(new Macro(name, ['4', '10']));
        expect(new MacroParser(`$${name}=9,72,0`).parse()).toEqual(new Macro(name, ['9', '72', '0']));
        expect(new MacroParser(`$${name}=6,15,1`).parse()).toEqual(new Macro(name, ['6', '15', '1']));
        expect(new MacroParser(`$${name}=9,72,2`).parse()).toEqual(new Macro(name, ['9', '72', '2']));
    });
    it('failure', () => {
        expect(new MacroParser(`$${name}=4,10,`).parse()).toEqual("");
    });
});

describe('parse face', () => {
    const name = 'face';
    it('success', () => {
        expect(new MacroParser(`$${name}=100,110,5,10,1,1`).parse()).toEqual(new Macro(name, ['100', '110', '5', '10', '1', '1']));
        expect(new MacroParser(`$${name}=100,110,5,10,1,1,2`).parse()).toEqual("");
    });
    it('failure', () => {
        expect(new MacroParser(`$${name}=100,110,5,10,1`).parse()).toEqual("");
    });
});

describe('parse delplayer', () => {
    const name = 'delplayer';
    it('success', () => {
        expect(new MacroParser(`$${name}=0`).parse()).toEqual(new Macro(name, ['0']));
        expect(new MacroParser(`$${name}=1`).parse()).toEqual(new Macro(name, ['1']));
        expect(new MacroParser(`$${name}=2`).parse()).toEqual(new Macro(name, ['2']));
    });
    it('failure', () => {
        expect(new MacroParser(`$${name}=2,3`).parse()).toEqual("");
    });
});

describe('parse imgclick', () => {
    const name = 'imgclick';
    it('success', () => {
        expect(new MacroParser(`$${name}=0`).parse()).toEqual(new Macro(name, ['0']));
        expect(new MacroParser(`$${name}=7,13`).parse()).toEqual(new Macro(name, ['7', '13']));
    });
    it('failure', () => {
        expect(new MacroParser(`$${name}=1,`).parse()).toEqual("");
        expect(new MacroParser(`$${name}=1,2,`).parse()).toEqual("");
    });
});

describe('parse color', () => {
    const name = 'color';
    it('success', () => {
        expect(new MacroParser(`$${name}=0,255,255,255`).parse()).toEqual(new Macro(name, ['0', '255', '255', '255']));
        expect(new MacroParser(`$${name}=1,0,0,0`).parse()).toEqual(new Macro(name, ['1', '0', '0', '0']));
        expect(new MacroParser(`$${name}=2,123,123,123`).parse()).toEqual(new Macro(name, ['2', '123', '123', '123']));
        expect(new MacroParser(`$${name}=4,53,53,53`).parse()).toEqual(new Macro(name, ['4', '53', '53', '53']));
        expect(new MacroParser(`$${name}=0,209,217,231`).parse()).toEqual(new Macro(name, ['0', '209', '217', '231']));
    });
});

describe('parse gameover', () => {
    const name = 'gameover';
    it('success', () => {
        expect(new MacroParser(`$${name}=1,2`).parse()).toEqual(new Macro(name, ['1', '2']));
    });
    it('failure', () => {
        expect(new MacroParser(`$${name}=1`).parse()).toEqual("");
    });
});

describe('parse dirmap', () => {
    const name = 'dirmap';
    it('success', () => {
        expect(new MacroParser(`$${name}=1,2`).parse()).toEqual(new Macro(name, ['1', '2']));
        expect(new MacroParser(`$${name}=1,2,0`).parse()).toEqual(new Macro(name, ['1', '2', '0']));
        expect(new MacroParser(`$${name}=1,2,1`).parse()).toEqual(new Macro(name, ['1', '2', '1']));
        expect(new MacroParser(`$${name}=1,2,2`).parse()).toEqual(new Macro(name, ['1', '2', '2']));
    });
    it('failure', () => {
        expect(new MacroParser(`$${name}=1,2,`).parse()).toEqual("");
        expect(new MacroParser(`$${name}=1`).parse()).toEqual("");
    });
});

describe('parse map', () => {
    const name = 'map';
    it('success', () => {
        expect(new MacroParser(`$${name}=1,2,3`).parse()).toEqual(new Macro(name, ['1', '2', '3']));
        expect(new MacroParser(`$${name}=1,2,3,0`).parse()).toEqual(new Macro(name, ['1', '2', '3', '0']));
        expect(new MacroParser(`$${name}=1,2,3,1`).parse()).toEqual(new Macro(name, ['1', '2', '3', '1']));
        expect(new MacroParser(`$${name}=1,2,3,2`).parse()).toEqual(new Macro(name, ['1', '2', '3', '2']));
    });
    it('failure', () => {
        expect(new MacroParser(`$${name}=1,2,3,`).parse()).toEqual("");
        expect(new MacroParser(`$${name}=1`).parse()).toEqual("");
    });
});

describe('parse imgframe', () => {
    const name = 'imgframe';
    it('success', () => {
        expect(new MacroParser(`$${name}=1,2,3`).parse()).toEqual(new Macro(name, ['1', '2', '3']));
    });
    it('failure', () => {
        expect(new MacroParser(`$${name}=1,2,3,`).parse()).toEqual("");
        expect(new MacroParser(`$${name}=1,2`).parse()).toEqual("");
    });
});

describe('parse imgbom', () => {
    const name = 'imgbom';
    it('success', () => {
        expect(new MacroParser(`$${name}=1,3`).parse()).toEqual(new Macro(name, ['1', '3']));
        expect(new MacroParser(`$${name}=10,3`).parse()).toEqual(new Macro(name, ['10', '3']));
    });
    it('failure', () => {
        expect(new MacroParser(`$${name}=1,2,`).parse()).toEqual("");
    });
});

describe('parse effect', () => {
    const name = 'effect';
    it('success', () => {
        expect(new MacroParser(`$${name}=100,3,4`).parse()).toEqual(new Macro(name, ['100', '3', '4']));
        expect(new MacroParser(`$${name}=5,10,10`).parse()).toEqual(new Macro(name, ['5', '10', '10']));
        expect(new MacroParser(`$${name}=100,11,4`).parse()).toEqual(new Macro(name, ['100', '11', '4']));
    });
    it('failure', () => {
        expect(new MacroParser(`$${name}=11,3`).parse()).toEqual("");
        expect(new MacroParser(`$${name}=1,2,`).parse()).toEqual("");
    });
});

describe('parse status', () => {
    const name = 'status';
    it('success', () => {
        expect(new MacroParser(`$${name}=0,100`).parse()).toEqual(new Macro(name, ['0', '100']));
        expect(new MacroParser(`$${name}=2,500`).parse()).toEqual(new Macro(name, ['2', '500']));
        expect(new MacroParser(`$${name}=4,10000`).parse()).toEqual(new Macro(name, ['4', '10000']));
    });
    it('failure', () => {
        expect(new MacroParser(`$${name}=100,11,4`).parse()).toEqual("");
        expect(new MacroParser(`$${name}=1,2,`).parse()).toEqual("");
    });
});

describe('parse sound', () => {
    const name = 'sound';
    it('success', () => {
        expect(new MacroParser(`$${name}=1`).parse()).toEqual(new Macro(name, ['1']));
        expect(new MacroParser(`$${name}=256`).parse()).toEqual(new Macro(name, ['256']));
    });
    it('failure', () => {
        expect(new MacroParser(`$${name}=1,`).parse()).toEqual("");
        expect(new MacroParser(`$${name}=`).parse()).toEqual("");
        expect(new MacroParser(`$${name}=a`).parse()).toEqual("");
    });
});
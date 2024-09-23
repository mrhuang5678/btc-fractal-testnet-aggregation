const width = 100;
const textwidth = 80;



async function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


const wrapText = (text, maxWidth) => {
    const lines = [];
    let currentLine = '';
    let currentWidth = 0;

    for (let char of text) {
        const charWidth = getTextWidth(char);

        if (currentWidth + charWidth > maxWidth) {
            lines.push(currentLine);
            currentLine = char;
            currentWidth = charWidth;
        } else {
            currentLine += char;
            currentWidth += charWidth;
        }
    }

    if (currentLine) {
        lines.push(currentLine);
    }

    return lines;
};


const centerTextWithBorders = (text) => {
    const wrappedLines = wrapText(text, textwidth);
    return wrappedLines.map(line => {
        const lineWidth = getTextWidth(line);
        if (width <= lineWidth + 2) {
            return `|${line}|`;
        }
        const totalSpaces = width - lineWidth - 2;
        const leftSpaces = Math.floor(totalSpaces / 2);
        const rightSpaces = totalSpaces - leftSpaces;
        return `|${' '.repeat(leftSpaces)}${line}${' '.repeat(rightSpaces)}|`;
    }).join('\n');
};


const getTextWidth = (text) => {
    const cleanText = text.replace(/\x1b\[\d{1,2}m/g, '');
    let width = 0;

    for (const char of cleanText) {
        if (char.match(/[\u4e00-\u9fa5\u3000-\u303F\uFF00-\uFFEF\u3040-\u30FF]/)) {
            width += 2;
        } else {
            width += 1;
        }
    }

    return width;
};


const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m'
};

const printDivider = (width) => {
    return `|${'-'.repeat(width - 2)}|`;
};

const centerTextmrhuang_ascii = (text, width) => {
    const lines = text.split('\n');
    return lines.map(line => {
        const lineWidth = getTextWidth(line);
        if (width <= lineWidth + 2) {
            return `|${line}|`;
        }
        const totalSpaces = width - lineWidth - 2;
        const leftSpaces = Math.floor(totalSpaces / 2);
        const rightSpaces = totalSpaces - leftSpaces;
        return `|${' '.repeat(leftSpaces)}${line}${' '.repeat(rightSpaces)}|`;
    }).join('\n');
};

async function countdown(waitTime) {
    return new Promise(resolve => {
        let index = waitTime;
        const timer = setInterval(() => {
            index--;
            const countdownText = `请等待: ${colors.green}${index}${colors.reset} 秒`;
            const centeredText = centerTextWithBorders(countdownText, width);
            process.stdout.write(`${colors.blue}${centeredText}${colors.reset}\r`);
            if (index === 0) {
                clearInterval(timer);
                const endText = '倒计时结束';
                const centeredEndText = centerTextWithBorders(endText, width);
                console.log(`${colors.blue}${centeredEndText}${colors.reset}`);
                resolve();
            }
        }, 1000);
    });
}


const mrhuang_ascii = `
███╗   ███╗██████╗        ██╗  ██╗██╗   ██╗ █████╗ ███╗   ██╗ ██████╗ 
████╗ ████║██╔══██╗       ██║  ██║██║   ██║██╔══██╗████╗  ██║██╔════╝ 
██╔████╔██║██████╔╝       ███████║██║   ██║███████║██╔██╗ ██║██║  ███╗
██║╚██╔╝██║██╔══██╗       ██╔══██║██║   ██║██╔══██║██║╚██╗██║██║   ██║
██║ ╚═╝ ██║██║  ██║██╗    ██║  ██║╚██████╔╝██║  ██║██║ ╚████║╚██████╔╝
╚═╝     ╚═╝╚═╝  ╚═╝╚═╝    ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝
`;


module.exports = {
    width,
    textwidth,
    getRandomNumber,
    wrapText,
    centerTextWithBorders,
    getTextWidth,
    colors,
    printDivider,
    centerTextmrhuang_ascii,
    countdown,
    mrhuang_ascii
};

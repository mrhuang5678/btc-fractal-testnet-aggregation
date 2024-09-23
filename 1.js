const { width, getRandomNumber, centerTextWithBorders, colors, printDivider, countdown, centerTextmrhuang_ascii, mrhuang_ascii } = require('./0');
const fs = require('fs').promises;
const axios = require('axios');
const { AddressType } = require('@unisat/wallet-sdk');
const { NetworkType } = require('@unisat/wallet-sdk/lib/network');
const { sendBTC } = require('@unisat/wallet-sdk/lib/tx-helpers');
const { LocalWallet } = require('@unisat/wallet-sdk/lib/wallet');
const wif = require('wif');


// -----------------------------------------------------------------------------------------------------
// 读取json文件内容
async function getDetailsFromTxt() {
    try {
        const txtContent = await fs.readFile('data/1.txt', 'utf-8');
        const lines = txtContent.split('\n').filter(line => line.trim() !== '');


        const walletDetails = lines.map((line, index) => {
            const [segwitAddress, segwitPrivateKey] = line.split('----');
            return {
                id: index + 1,
                segwitAddress: segwitAddress.trim(),
                segwitPrivateKey: segwitPrivateKey.trim(),
            };
        });

        return walletDetails;
    } catch (error) {
        console.log(`${colors.green}${centerTextWithBorders('读取TXT文件出错', width)}${colors.reset}`);
        throw error;
    }
}


// ----------------------------------------------------------------------------------------------------

// 查询余额
async function get1(url, apikey) {
    try {
        const headers = {
            'accept': 'application/json',
            'Authorization': `Bearer ${apikey}`,
        };
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
}


async function post1(url, apikey, txHex) {
    try {
        const data = {
            txHex: txHex
        };
        const headers = {
            'accept': 'application/json',
            'Authorization': `Bearer ${apikey}`,
            'Content-Type': 'application/json'
        };
        const response = await axios.post(url, data, { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
}


// ----------------------------------------------------------------------------------------------------

// 创建
async function createTransaction(utxoList, totalInputSatoshis, fee, toAddress, privateKeyWIF) {
    try {
        const wallet = new LocalWallet(privateKeyWIF, AddressType.P2WPKH, NetworkType.MAINNET);

        const btcUtxos = utxoList.map((v) => ({
            txid: v.txid,
            vout: v.vout,
            satoshis: v.satoshi,
            scriptPk: v.scriptPk,
            pubkey: wallet.pubkey,
            addressType: wallet.addressType,
            inscriptions: v.inscriptions,
            atomicals: [],
        }));


        const { psbt, toSignInputs } = await sendBTC({
            btcUtxos: btcUtxos,
            tos: [
                {
                    address: toAddress,
                    satoshis: totalInputSatoshis - fee,
                },
            ],
            networkType: wallet.networkType,
            changeAddress: wallet.address,
            feeRate: 1,
        });

        await wallet.signPsbt(psbt, {
            autoFinalized: true,
            toSignInputs,
        });

        const rawtx = psbt.extractTransaction().toHex();
        return rawtx;
    } catch (error) {
        throw error;
    }
}


// ----------------------------------------------------------------------------------------------------

// 主函数
async function main() {

    console.log(`${colors.red}${printDivider(width)}${colors.reset}`);
    console.log(`${colors.cyan}${centerTextmrhuang_ascii(mrhuang_ascii, width)}${colors.reset}`);
    console.log(`${colors.red}${printDivider(width)}${colors.reset}`);
    console.log(`${colors.green}${centerTextWithBorders("分型水批量归集脚本", width)}${colors.reset}`);
    console.log(`${colors.blue}${centerTextWithBorders("请等待", width)}${colors.reset}`);
    console.log(`${colors.red}${printDivider(width)}${colors.reset}`);

    let utxoList = [];

    try {
        const getDetaJson = await getDetailsFromTxt();
        const toAddress = 'bc1qlh7q7s4urp2lz7y9rf77s5624u6h6nlv0t332u';
        const apikey = '2fdd578fd7e2013297c622e60b7cf4bfae37cf137f5cd5ded8e0e576560870d9';
        for (const item of getDetaJson) {
            console.log(`${colors.red}${centerTextWithBorders(`${item.id} 开始任务`, width)}${colors.reset}`);
            console.log(`${colors.cyan}${centerTextWithBorders(`Segwit地址: ${item.segwitAddress}`, width)}${colors.reset}`);
            console.log(`${colors.cyan}${centerTextWithBorders(`Segwit私钥 (WIF格式): ${item.segwitPrivateKey}`, width)}${colors.reset}`);
            console.log(`${colors.red}${printDivider(width)}${colors.reset}`);


            // 生成WIF私钥
            // const privateKey = Buffer.from(item.segwitPrivateKey, 'hex');
            // const privateKeyWIF = wif.encode(128, privateKey, true);
            // console.log(`${colors.blue}${centerTextWithBorders(`Segwit私钥 (WIF格式): ${privateKeyWIF}`, width)}${colors.reset}`);

            console.log(`${colors.red}${printDivider(width)}${colors.reset}`);
            const url2 = `https://open-api-fractal-testnet.unisat.io/v1/indexer/address/${item.segwitAddress}/utxo-data?cursor=0&size=16`
            const data2 = await get1(url2, apikey);

            if (data2 && data2.code === 0 && data2.msg === 'ok') {
                const { utxo } = data2.data;
                utxoList = utxo;
                console.log(`${colors.green}${centerTextWithBorders(`获取UTXO成功:`, width)}${colors.reset}`);


            } else {
                console.log(`${colors.red}${centerTextWithBorders(`获取UTXO失败: ${data2 ? data2.msg : '未知错误'}`, width)}${colors.reset}`);
            }

            console.log(`${colors.red}${printDivider(width)}${colors.reset}`);

            const totalInputSatoshis = utxoList.reduce((sum, v) => sum + v.satoshi, 0);
            console.log(`${colors.green}${centerTextWithBorders(`UTXO 的satoshis总量: ${totalInputSatoshis}`, width)}${colors.reset}`);

            // 设置手续费，单位是 satoshis，如果报错可以增加gas费一般300不会出现报错。
            const fee = 300;
            if (totalInputSatoshis <= fee) {

                console.log(`${colors.green}${centerTextWithBorders(`UTXO 总量satoshis不足以支付手续费, 跳出循环:`, width)}${colors.reset}`);
                console.log(`${colors.red}${printDivider(width)}${colors.reset}`);
                continue;
            }



            const txidOrPsbtHex = await createTransaction(utxoList, totalInputSatoshis, fee, toAddress, item.segwitPrivateKey);


            console.log(`${colors.red}${printDivider(width)}${colors.reset}`);
            const url3 = 'https://open-api-fractal-testnet.unisat.io/v1/indexer/local_pushtx'
            const data3 = await post1(url3, apikey, txidOrPsbtHex);
            if (data3 && data3.code === 0 && data3.msg === 'ok') {
                console.log(`${colors.green}${centerTextWithBorders(`提交交易成功:`, width)}${colors.reset}`);
                console.log(`${colors.green}${centerTextWithBorders(`交易哈希: ${data3.data}`, width)}${colors.reset}`);

            } else {
                console.log(`${colors.red}${centerTextWithBorders(`提交交易失败: ${data2 ? data2.msg : '未知错误'}`, width)}${colors.reset}`);
            }

            console.log(`${colors.red}${printDivider(width)}${colors.reset}`);
            console.log(`${colors.red}${centerTextWithBorders(`${item.id} 结束任务`, width)}${colors.reset}`);
            console.log(`${colors.red}${printDivider(width)}${colors.reset}`);


            const randomNumber = await getRandomNumber(2, 5);
            console.log(`${colors.blue}${centerTextWithBorders(`等待时间: ${randomNumber} 秒`, width)}${colors.reset}`);
            console.log(`${colors.red}${printDivider(width)}${colors.reset}`);

            await countdown(randomNumber);
        }

    } catch (error) {
        console.log(`${colors.blue}${centerTextWithBorders(`发生错误已经停止运行: ${error.message}`, width)}${colors.reset}`);
        const randomNumber = await getRandomNumber(60, 100);
        console.log(`${colors.blue}${centerTextWithBorders(`重新开始,等待时间: ${randomNumber} 秒`, width)}${colors.reset}`);
        console.log(`${colors.red}${printDivider(width)}${colors.reset}`);
        await countdown(randomNumber);
    }
}

// 执行主函数
main();

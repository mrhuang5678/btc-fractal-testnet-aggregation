# 项目使用说明

btc 分形测试网批量归集

```
Mr.Huang 编写

```

## 1. 安装依赖

在项目根目录下运行以下命令来安装所需的依赖包：

```
npm install
```

或者:

```
npm install axios fs @unisat/wallet-sdk wif

```

如果遇到报错，可以使用彻底清除 npm 缓存下面命令:

```
npm cache clean --force

```

如果遇到报错缺少 patch-package 可以使用下面命令安装依赖库:

```
sudo npm install -g patch-package
```

## 2. 准备数据目录

在项目根目录下创建一个名为`data`的目录，并在其中创建`1.txt`文件。该文件中应包含 钱包地址----wif 格式私钥等。

- `1.txt`文件内容应以`一行一个钱包地址----wif格式私钥`。
- 注意： 不要添加,符号。

## 3. 项目修改

- toAddress 接收钱包地址
- apikey 接口 key
- AddressType.P2WPKH 钱包类型

如果是派生成的私钥需要转 wif 格式。

在项目里面修改项目：

- 将"生成 WIF 私钥"下面代码注释去掉,然后将下面代码去替换掉

```
const txidOrPsbtHex = await createTransaction(utxoList, totalInputSatoshis, fee, toAddress, privateKeyWIF);
```

## 4. 运行项目

在项目根目录下运行以下命令来启动项目：

```
node 1.js
```

设置手续费，单位是 satoshis，如果报错可以增加 gas 费一般 300 不会出现报错：

```
const fee = 300;

```

## 5. 添加多号, 一行一个。

`1.txt`文件项目：

```
bc1qxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxAqdn----L2bRxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxiD5o
bc1qxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx6tw2----L3NnxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxuxJ2
```

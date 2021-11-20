const fs = require("fs");
let {networkConfig} = require("../helper-config")
module.exports = async ({
    getNamedAccounts,
    deployments,
    getChainId
}) =>{
    const {deploy,log} = deployments
    const {deployer} = await getNamedAccounts()
    const chainId = await getChainId()
    log("----------------------------------     -------------------------")
    const SVGNFT = await deploy("SVGNFTJK",{
        from: deployer,
        log:true
    })
    log(`NFT contract deployed in ${SVGNFT.address}`)
    let filepath = "./img/circle.svg"
    let svg = fs.readFileSync(filepath,{encoding:"utf8"}) 

    const svgNFTContract = await ethers.getContractFactory("SVGNFTJK")
    const accounts = await hre.ethers.getSigners()
    const signer = accounts[0]
    const svgNFT = new ethers.Contract(SVGNFT.address,svgNFTContract.interface,signer)
    const networkName = networkConfig[chainId]["name"]
    log(`verify with: \n npx hardhat verify --network ${networkName} ${svgNFT.address}`)
    let transactionresponse = await svgNFT.create(svg)
    let receipt = await transactionresponse.wait(1)
    log("you've made an NFT!!!")
    log(`you can view the TOKENURI here ${await svgNFT.tokenURI(0)}`)
}
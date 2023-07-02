const authDeploy = async () => {
    const accounts = await ethers.getSigners()
    const contractOwner = accounts[0];
    console.log(contractOwner);

}

authDeploy();
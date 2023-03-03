const list =[];
async function main() {
  //compiles
    const org = await ethers.getContractFactory("ElectionOrganizer");
    const auth = await ethers.getContractFactory("Authentication");
    const brightid = await ethers.getContractFactory("BrightID");

    // Start deployment, returning a promise that resolves to a contract object
    const contract1 = await auth.deploy();   
    await contract1.deployed();
    
    console.log("Contract auth deployed to address:", contract1.address);

    const contract2 = await org.deploy();   
    await contract2.deployed();
    
    console.log("Contract org deployed to address:", contract2.address);

    const contract3 = await brightid.deploy();   
    await contract3.deployed();
    
    console.log("Contract bright deployed to address:", contract3.address);
    
 }
 
 main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });
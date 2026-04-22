import hre from "hardhat";

async function main() {
  const Certificate = await hre.ethers.getContractFactory("Certificate");
  const certificate = await Certificate.deploy();

  await certificate.waitForDeployment();

  console.log(`Certificate contract deployed to: ${await certificate.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

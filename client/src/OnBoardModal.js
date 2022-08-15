import { useState, useEffect } from 'react';
import { Modal, Button, Card, Flex, Image, Loader, Heading, Icon, Text, Box, Link, MetaMaskButton, EthAddress } from "rimble-ui";
// import '../../styles/Modal.scss';

function OnBoardModal({step, account, balance}) {
    const [isOpen, setIsOpen] = useState(step !== -1);
    console.log(step, account)
  
    const closeModal = e => {
      e.preventDefault();
      setIsOpen(false);
    };

    const openModal = e => {
        e.preventDefault();
        setIsOpen(true);
    };

    useEffect(() => {
        setIsOpen(step !== -1)
    }, [step])

    const switchAvaxNetwork = async () => {
        await window?.ethereum?.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xA869',
              chainName: 'Avalanche Fuji Chain',
              nativeCurrency: {
                  name: 'Fuji Test Coin',
                  symbol: 'AVAX',
                  decimals: 18
              },
              rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
              blockExplorerUrls: ['https://cchain.explorer.avax-test.network/']
            }]
        }).catch((error) => {
            console.log(error)
        });      
    }

    const installMetaMaskRedirect = () => {
        window.open('https://metamask.io/download', '_blank');
    }

    const getFundsRedirect = () => {
        window.open('https://faucet.avax-test.network/', '_blank');
    }

    const connectAccountRequest = () => {
        window?.ethereum?.request({
            method: "eth_requestAccounts"
        })
    }

    const InstallMetamask = () => {
        return (
            <>
                <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    borderBottom={1}
                    borderColor="near-white"
                    p={[3, 4]}
                    pb={3}
                >
                    <Image
                        src="/assets/agora.png"
                        aria-label="agora"
                        size="35px"
                    />
                    <Heading textAlign="center" as="h1" fontSize={[2, 3]} px={[3, 0]}>
                        Install MetaMask to use Agora
                    </Heading>

                    <Link>
                    
                    </Link>
                </Flex>

                <Box p={[3, 4]}>
                    <Text mb={4}>
                        MetaMask is a browser extension that will let you use our blockchain
                        features in this browser. It may take you a few minutes to set up your
                        MetaMask account.
                    </Text>

                    <Text>
                        Use the button below to install MetaMask as your browser extension. If you
                        already installed MetaMask then try refreshing or enabling the MetaMask from
                        your browser's extension settings.
                    </Text>
                </Box>
                
                <Flex justifyContent="flex-end" borderTop={1} borderColor="light-gray" p={[3, 4]}>
                    <MetaMaskButton onClick={installMetaMaskRedirect} width={["100%", "auto"]}>
                        Install MetaMask
                    </MetaMaskButton>
                </Flex>
            </>
        )
    }

    const SwitchNetwork = () => {
        return (
            <>
                <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    borderBottom={1}
                    borderColor="near-white"
                    p={[3, 4]}
                    pb={3}
                >
                    <Image
                        src="/assets/avalanche.png"
                        aria-label="agora"
                        size="35px"
                    />
                    <Heading textAlign="center" as="h1" fontSize={[2, 3]} px={[3, 0]}>
                        Switch to <font color="#e84142"><b> Avalanche's Fuji</b></font> network to use Agora
                    </Heading>

                    <Link>
                    
                    </Link>
                </Flex>

                <Box p={[3, 4]}>
                    <Text mb={4}>
                        Agora's backend or you could say the logic, is deployed on Avalanche's
                        Fuji network. MetaMask would help us in connecting to that network.
                    </Text>

                    <Text>
                        Please switch to the required network, by clicking the 
                        <font color="blue"><b> Switch</b></font> button below.
                        Sorry for the inconvinience caused.
                    </Text>
                </Box>
                
                <Flex justifyContent="flex-end" borderTop={1} borderColor="light-gray" p={[3, 4]}>
                    <Button onClick={switchAvaxNetwork}>
                        Switch
                    </Button>
                </Flex>
            </>
        )
    }

    const AddFunds = () => {
        return (
            <>
                <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    borderBottom={1}
                    borderColor="near-white"
                    p={[3, 4]}
                    pb={3}
                >
                    <Image
                        src="/assets/avalanche.png"
                        aria-label="agora"
                        size="35px"
                    />
                    <Heading textAlign="center" as="h1" fontSize={[2, 3]} px={[3, 0]}>
                        Add funds to your wallet
                    </Heading>

                    <Link>
                    
                    </Link>
                </Flex>

                <Box p={[3, 4]}>
                    <Text mb={4}>
                        We have noticed that, you own less than <font color="red"><b> 1 AVAX </b></font>
                        in your wallet. You can always get free test tokens (upto <font color="green"><b> 10 AVAX</b></font>)
                        at Avalanche's test faucet.
                    </Text>

                    <Text mb={4}>
                        Though browsing through our application doesn't cost you tokens, but without tokens, you can't
                        vote or create elections. Tokens are required as a transaction fee to write
                        anything on the blockchain.
                    </Text>

                    <Text mb={4}>
                        Click on <font color="blue"><b>Add Tokens</b></font> button and paste
                        your wallet public address (copy from below), to get free tokens!
                    </Text>

                    <EthAddress address={account}/>

                    <br/>

                    <font color="#005eb5">
                        If you already added tokens, then please <b style={{cursor: "pointer"}} onClick={() => window.location.reload()}>refresh</b> the page.
                    </font>
                </Box>
                
                <Flex justifyContent="flex-end" borderTop={1} borderColor="light-gray" p={[3, 4]}>
                    <Button onClick={getFundsRedirect}>
                        Add Tokens
                    </Button>
                </Flex>
            </>
        )
    }

    const ConnectAccount = () => {
        console.log("connect account modal")
        return (
            <>
                <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    borderBottom={1}
                    borderColor="near-white"
                    p={[3, 4]}
                    pb={3}
                >
                    <Loader size={"35px"}/>

                    <Heading textAlign="center" as="h1" fontSize={[2, 3]} px={[3, 0]}>
                        Confirm connection in MetaMask
                    </Heading>
                    
                    <Link>
                        <Icon
                            name="Close"
                            color="moon-gray"
                            aria-label="Close and cancel connection"
                        />
                    </Link>
                </Flex>

                <Box p={[3, 4]}>
                    <Text mb={4}>
                        Confirm the request that's just appeared. If you can't see a request, then
                        click on the <font color="blue"><b>Connect</b></font> button, or if you are already connected, 
                        then refresh your browser.
                    </Text>

                    <Text mb={4}>
                        Waiting for connection confirmation.
                        <b> This won’t cost you any AVAX</b>
                    </Text>
                </Box>

                <Flex justifyContent="flex-end" borderTop={1} borderColor="light-gray" p={[3, 4]}>
                    <Button onClick={connectAccountRequest}>
                        Connect
                    </Button>
                </Flex>
            </>
        )
    }

    return (
        <div>            
            <Modal isOpen={isOpen}>
                <Card width={"90%"} p={0} style={{maxWidth: "600px", width: "fit-content"}}>
                    {
                        step === 0
                        ?
                        <InstallMetamask/>
                        :
                        step === 1
                        ?
                        <ConnectAccount/>
                        :
                        step === 2
                        ?
                        <SwitchNetwork/>
                        :
                        <AddFunds/>                                                                                               
                    }
                </Card>
            </Modal>
        </div>
    );
}

export default OnBoardModal;
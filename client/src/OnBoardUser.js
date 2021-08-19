import OnBoardModal from './OnBoardModal';
import { useState, useMemo } from 'react';

const OnboardUser = () => {
    const [step, setStep] = useState(-1);
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(0);

    // console.log(window?.ethereum?.chainId)

    useMemo(() => {
        if(window.ethereum == undefined) {
            setStep(0)
        } else if(window?.ethereum?.chainId != 43113) {
            // alert(window?.ethereum?.chainId);
            setStep(1);
        } else if(window?.ethereum?.chainId == 43113) {
            // alert(window?.ethereum?.chainId);
            window.ethereum.request({
                method: 'eth_requestAccounts' 
            }).then((res) => {
                window?.ethereum?.request({
                    method: "eth_accounts"
                }).then((res) => {
                    setAccount(res[0]);
    
                    window?.ethereum?.request({
                        method: "eth_getBalance",
                        params: [res[0], 'latest']
                    }).then(async (res) => {
                        let _balance = res/1000000000000000000;
                        if(_balance < 1) {
                            setStep(2)
                            setBalance(_balance);
                        }
                    });
                });
            }).catch((error) => {
                setStep(3);
                if (error.code === 4001) {
                    console.log('Please connect to MetaMask.');
                } else {
                    console.error(error);
                }
            });
        }
    }, [window?.ethereum, window?.ethereum?.chainId, step, balance, account])

    return (
        <div>
            <OnBoardModal step={step} account={account} balance={balance}/>
        </div>
    )
}

export default OnboardUser;
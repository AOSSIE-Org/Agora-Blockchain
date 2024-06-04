import styles from './HowItWorks.module.css';

const HowItWorks = () => {
    return (  
        <div className={styles.howItWorks}>
            <h1>How it works?</h1>
            <div>
                
                OneVote utilizes zero knowledge proofs to achieve anonymity while voting.
            </div>
            <div>
                Semaphore smart contracts allow users to register their identity and store it on blockchain.
            </div>
            <div>
                Once registered, users are able to vote on existing votings or to create a new voting process.
            </div>
            <div>
                During the voting process, dapp downloads snark circuit and proving key from <a style={{color: "#f1356d"}} href="https://github.com/weijiekoh/semaphore-ui" target="_blank">semaphore ui</a> github repo.
            </div>
            <div>
                Identity commitments are downloaded from the merkle tree stored on blockchain.
            </div>
            <div>
                Dapp generates the proof, which checks that user is in the semaphore group
            </div>
            <div>
                (User's identity commitment is in the merkle tree). It also checks if user has already voted
            </div>
            <div>
                (every user can vote only once).
            </div>
            <div>
                After the proof is generated, voting happens. During voting, proof is verified.
            </div>
            <div>
                If Successful votes are updated and shown to the user.
            </div>
            <h3 style={{marginTop: "1em"}}>How to get started with zero knowledge?</h3>
            <div>
                Visit <a style={{color: "#f1356d"}} href="https://zku.one/" target="_blank">ZK University</a>.
            </div>
            <div className={styles.bigBtn}>
                Happy voting :)
            </div>
        </div>
    );
}
 
export default HowItWorks;
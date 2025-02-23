
import {
    Identity,
    genIdentity,
    genIdentityCommitment,
    genCircuit,
    serialiseIdentity,
	genWitness,
    genExternalNullifier,
    genProof,
    genPublicSignals,
    genBroadcastSignalParams,
} from 'libsemaphore-no-test';

import {
    initStorage,
    storeId,
    retrieveId,
    hasId,
} from './semaphoreStorage';

const initLocalStorage = () => {
    initStorage();
}

const generateIdentityCommitment = () => {
    let identity = "";
    if (hasId()) {
        identity = retrieveId()
    } else {
        identity = genIdentity()
        storeId(identity)
    }
    let identityCommitment = genIdentityCommitment(identity)
    return identityCommitment;
}

const getExternalNullifiers = async (semaphoreContract) => {
    const firstEn = await semaphoreContract.firstExternalNullifier()
    const lastEn = await semaphoreContract.lastExternalNullifier()

    const ens = [ firstEn ]
    let currentEn = firstEn

    while (currentEn.toString() !== lastEn.toString()) {
        currentEn = await semaphoreContract.getNextExternalNullifier(currentEn)
        ens.push(currentEn)
    }

    return ens
}

export {
    initLocalStorage,
    generateIdentityCommitment
}
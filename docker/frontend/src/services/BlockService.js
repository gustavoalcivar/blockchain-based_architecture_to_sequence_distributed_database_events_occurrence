const apiURL = "http://192.168.100.200:4000/blocks";

export default async function getBlocks() {
    return fetch(apiURL)
    .then(res => res.json())
    .then(response => {
        const trxs = [];
        const { blocks } = response
        blocks.forEach(block => {
            if(block.block_num !== "0") {
                block.batches.forEach(batch => {
                    batch.transactions.forEach(transaction => {
                        let jsonData = Object.assign({}, transaction.payload.data);
                        delete jsonData["application_time"];
                        delete jsonData["application_user"];
                        let data = JSON.stringify(jsonData);
                        let trx = {
                            id: transaction.id,
                            block_num: block.block_num,
                            block_hash: block.block_hash,
                            previous_block_hash: block.previous_block_hash,
                            signer_public_key: transaction.signer_public_key,
                            nonce: transaction.nonce,
                            payload: JSON.stringify(transaction.payload),
                            table: transaction.payload.metadata.table,
                            data: data,
                            host: transaction.payload.metadata.host,
                            blockchain_host: transaction.payload.metadata.blockchain_host,
                            application_time: transaction.payload.data.application_time,
                            blockchain_time: transaction.payload.metadata.datetime,
                            unixDatetime: transaction.payload.metadata.unixDatetime
                        };
                        trxs.push(trx);
                    });
                });
            } else {
                let trx = {
                    id: block.batches[0].transactions[0].id,
                    block_num: block.block_num,
                    block_hash: block.block_hash,
                    previous_block_hash: block.previous_block_hash,
                    signer_public_key: block.batches[0].transactions[0].signer_public_key,
                    payload: "GENESIS BLOCK"
                };
                trxs.push(trx);
            }
        });
        return trxs;
    });
}
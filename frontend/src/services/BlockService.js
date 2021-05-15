export default async function getBlocks(head) {
    return fetch(`${window.location.href.split(":")[0]}:${window.location.href.split(":")[1]}:4000/blocks/${head ? head : ''}`.replace("/:", ":"))
    .then(res => res.json())
    .then(response => {
        const trxs = [];
        const { blocks } = response
        blocks.forEach(block => {
            if(block.block_num !== "0") {
                block.batches.forEach(batch => {
                    batch.transactions.forEach(transaction => {
                        let jsonData = Object.assign({}, transaction.payload);
                        delete jsonData["database_time"];
                        delete jsonData["application_time"];
                        delete jsonData["application_user"];
                        delete jsonData["database"];
                        delete jsonData["table"];
                        delete jsonData["transaction"];
                        delete jsonData["database_user"];
                        delete jsonData["client_host"];
                        delete jsonData["datetime"];
                        delete jsonData["unixDatetime"];
                        delete jsonData["blockchain_host"];
                        delete jsonData["database_host"];
                        let data = JSON.stringify(jsonData, null, 2);
                        let trx = {
                            id: transaction.id,
                            block_num: block.block_num,
                            block_hash: block.block_hash,
                            previous_block_hash: block.previous_block_hash,
                            signer_public_key: transaction.signer_public_key,
                            nonce: transaction.nonce,
                            payload: JSON.stringify(transaction.payload),
                            table: transaction.payload.table,
                            transaction: transaction.payload.transaction,
                            application_user: transaction.payload.application_user,
                            data: data,
                            client_host: transaction.payload.client_host,
                            blockchain_host: transaction.payload.blockchain_host,
                            database_host: transaction.payload.database_host,
                            application_time: transaction.payload.application_time,
                            database_time: transaction.payload.database_time,
                            blockchain_time: transaction.payload.datetime,
                            unixDatetime: transaction.payload.unixDatetime
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
        return trxs.sort((a,b)=> (a.blockchain_time < b.blockchain_time ? 1 : -1));
    });
}
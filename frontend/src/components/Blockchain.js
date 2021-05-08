import React, { useState, useEffect } from 'react';
import '../App.css';
import Block from './Block';
import getBlocks from '../services/BlockService';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@material-ui/core';

export default function Blockchain() {
    const [blocks, setBlocks] = useState([]);
    const [previousPagesIds, setPreviousPagesIds] = useState([]);
    useEffect(() => getBlocks().then(blocks => setBlocks(blocks)), []);
    return(
        <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
                <TableHead className="Head">
                    <TableRow>
                        <TableCell align="center">
                            <button onClick={() => {
                                if(blocks[blocks.length - 1].block_num !== "0") {
                                    getBlocks(blocks[blocks.length - 1].previous_block_hash).then(blocks => setBlocks(blocks));
                                    setPreviousPagesIds(previousIds => [...previousIds, blocks[0].block_hash]);
                                }
                            }}>Previous blocks</button>
                            <button onClick={() => {
                                getBlocks(previousPagesIds[previousPagesIds.length - 1]).then(blocks => setBlocks(blocks));
                                previousPagesIds.pop();
                            }}>Next blocks</button>
                        </TableCell>
                        <TableCell align="center"><Box fontWeight="fontWeightBold" m={1}>Block</Box></TableCell>
                        <TableCell align="center"><Box fontWeight="fontWeightBold" m={1}>Transaction</Box></TableCell>
                        <TableCell align="center"><Box fontWeight="fontWeightBold" m={1}>Table</Box></TableCell>
                        <TableCell align="center"><Box fontWeight="fontWeightBold" m={1}>Application user</Box></TableCell>
                        <TableCell align="center"><Box fontWeight="fontWeightBold" m={1}>Data</Box></TableCell>
                        <TableCell align="center"><Box fontWeight="fontWeightBold" m={1}>Database server</Box></TableCell>
                        <TableCell align="center"><Box fontWeight="fontWeightBold" m={1}>Application time</Box></TableCell>
                        <TableCell align="center"><Box fontWeight="fontWeightBold" m={1}>Database time</Box></TableCell>
                        <TableCell align="center"><Box fontWeight="fontWeightBold" m={1}>Blockchain time</Box></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {
                    blocks.map((block) =>
                        <Block
                            key={block.id}
                            block_num={block.block_num}
                            block_hash={block.block_hash}
                            previous_block_hash={block.previous_block_hash}
                            signer_public_key={block.signer_public_key}
                            nonce={block.nonce}
                            payload={block.payload}
                            table={block.table}
                            transaction={block.transaction}
                            application_user={block.application_user}
                            data={block.data}
                            client_host={block.client_host}
                            blockchain_host={block.blockchain_host}
                            database_host={block.database_host}
                            application_time={block.application_time}
                            database_time={block.database_time}
                            blockchain_time={block.blockchain_time}
                            unixDatetime={block.unixDatetime}
                        />
                    )
                }
                </TableBody>
            </Table>
        </TableContainer>
    );
}
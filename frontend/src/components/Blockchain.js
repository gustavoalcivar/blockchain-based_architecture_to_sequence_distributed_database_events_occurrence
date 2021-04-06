import React, { useState, useEffect } from 'react';
import '../App.css';
import Block from './Block';
import getBlocks from '../services/BlockService';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@material-ui/core';

export default function Blockchain() {
    const [blocks, setBlocks] = useState([]);
    useEffect(() => getBlocks().then(blocks => setBlocks(blocks)), []);
    return(
        <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
                <TableHead className="Head">
                    <TableRow>
                        <TableCell align="center"></TableCell>
                        <TableCell align="center"><Box fontWeight="fontWeightBold" m={1}>Block</Box></TableCell>
                        <TableCell align="center"><Box fontWeight="fontWeightBold" m={1}>Transaction</Box></TableCell>
                        <TableCell align="center"><Box fontWeight="fontWeightBold" m={1}>Table</Box></TableCell>
                        <TableCell align="center"><Box fontWeight="fontWeightBold" m={1}>Data</Box></TableCell>
                        <TableCell align="center"><Box fontWeight="fontWeightBold" m={1}>Server</Box></TableCell>
                        <TableCell align="center"><Box fontWeight="fontWeightBold" m={1}>Application time</Box></TableCell>
                        <TableCell align="center"><Box fontWeight="fontWeightBold" m={1}>Blockchain time</Box></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {
                    blocks.map((block, index) =>
                        <Block
                            key={block.id}
                            block_num={block.block_num}
                            index={blocks.length - index - 1}
                            block_hash={block.block_hash}
                            previous_block_hash={block.previous_block_hash}
                            signer_public_key={block.signer_public_key}
                            nonce={block.nonce}
                            payload={block.payload}
                            table={block.table}
                            transaction={block.transaction}
                            data={block.data}
                            host={block.host}
                            blockchain_host={block.blockchain_host}
                            application_time={block.application_time}
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
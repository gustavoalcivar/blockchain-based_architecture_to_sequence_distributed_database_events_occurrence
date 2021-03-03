import React, { useState } from 'react';
import { TableCell, TableRow, Box } from '@material-ui/core';
import Modal from 'react-modal'
import '../App.css';

Modal.setAppElement('#root');

export default function Block({ block_num, index, block_hash, previous_block_hash, signer_public_key, nonce, payload, table, transaction, data, host, blockchain_host, application_time, blockchain_time, unixDatetime }) {
    const [detailsIsOpen, setDetailsIsOpen] = useState(false);
    return(
        <TableRow>
            <TableCell align="center"><button onClick={() => setDetailsIsOpen(true)}>View transaction</button></TableCell>
            <TableCell align="center" component="th" scope="row">{block_num}</TableCell>
            <TableCell align="center">{index}</TableCell>
            <TableCell align="center">{table}</TableCell>
            <TableCell align="center">{data}</TableCell>
            <TableCell align="center">{host}</TableCell>
            <TableCell align="center">{blockchain_host}</TableCell>
            <TableCell align="center">{application_time}</TableCell>
            <TableCell align="center">{blockchain_time}</TableCell>
            <Modal
            isOpen={detailsIsOpen}
            onRequestClose={() => setDetailsIsOpen(false)}
            style={
                {
                    overlay: {
                        backgroundColor: 'grey'
                    },
                    content: {
                        color: 'darkblue'
                    }
                }
            }>
                <div>
                    <button onClick={() => setDetailsIsOpen(false)}>Close</button>
                </div>
                <h3>Transaction details</h3>
                <Box fontWeight="fontWeightBold" m={1}>Block num</Box>
                <Box fontWeight="fontWeightRegular" m={1}>{block_num}</Box>
                <Box fontWeight="fontWeightBold" m={1}>Block hash</Box>
                <Box fontWeight="fontWeightRegular" m={1}>{block_hash}</Box>
                <Box fontWeight="fontWeightBold" m={1}>Previous block hash</Box>
                <Box fontWeight="fontWeightRegular" m={1}>{previous_block_hash}</Box>
                <Box fontWeight="fontWeightBold" m={1}>Signer public key</Box>
                <Box fontWeight="fontWeightRegular" m={1}>{signer_public_key}</Box>
                <Box fontWeight="fontWeightBold" m={1}>Nonce</Box>
                <Box fontWeight="fontWeightRegular" m={1}>{nonce}</Box>
                <Box fontWeight="fontWeightBold" m={1}>Server</Box>
                <Box fontWeight="fontWeightRegular" m={1}>{host}</Box>
                <Box fontWeight="fontWeightBold" m={1}>Blockchain host</Box>
                <Box fontWeight="fontWeightRegular" m={1}>{blockchain_host}</Box>
                <Box fontWeight="fontWeightBold" m={1}>Table</Box>
                <Box fontWeight="fontWeightRegular" m={1}>{table}</Box>
                <Box fontWeight="fontWeightBold" m={1}>Transaction</Box>
                <Box fontWeight="fontWeightRegular" m={1}>{transaction}</Box>
                <Box fontWeight="fontWeightBold" m={1}>Application time</Box>
                <Box fontWeight="fontWeightRegular" m={1}>{application_time}</Box>
                <Box fontWeight="fontWeightBold" m={1}>Blockchain time</Box>
                <Box fontWeight="fontWeightRegular" m={1}>{blockchain_time}</Box>
                <Box fontWeight="fontWeightBold" m={1}>Unix time</Box>
                <Box fontWeight="fontWeightRegular" m={1}>{unixDatetime}</Box>
                <Box fontWeight="fontWeightBold" m={1}>Payload</Box>
                <Box fontWeight="fontWeightRegular" m={1}>{payload}</Box>
            </Modal>
        </TableRow>
    );
}
import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';

import DescribeInfoRow from './DescribeInfoRow';

import { words, capitalize } from '../../utils';

const State = ({ title, state, tableClassName }) => {
  const stateKey = Object.keys(state).find(key => state[key]);

  if (stateKey) {
    return (
      <DescribeInfoRow title={title}>
        <Table className={tableClassName}>
          <TableBody>
            <DescribeInfoRow title={capitalize(words(stateKey))}/>
            {Object.keys(state[stateKey]).filter(key => state[stateKey][key]).map(key => (
              <DescribeInfoRow title={capitalize(words(key))} key={key}>
                {state[stateKey][key]}
              </DescribeInfoRow>
            ))}
          </TableBody>
        </Table>
      </DescribeInfoRow>
    );
  }

  return (null);
};

export default State;

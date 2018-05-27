import React from 'react';
import PropTypes from 'prop-types';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';

import DescribeInfoRow from './DescribeInfoRow';

import { capitalize } from '../../utils';

const Resources = ({ title, resources, tableClassName }) => {
  if (resources) {
    return (
      <DescribeInfoRow title={title}>
        <Table className={tableClassName}>
          <TableBody>
            {Object.keys(resources).map(key => (
              <DescribeInfoRow title={capitalize(key)} key={key}>
                {resources[key]}
              </DescribeInfoRow>
            ))}
          </TableBody>
        </Table>
      </DescribeInfoRow>
    );
  }

  return (null);
};

Resources.propTypes = {
  resources: PropTypes.object,
  tableClassName: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default Resources;

import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';

import DescribeInfoRow from './DescribeInfoRow';

import { boolean } from '../../utils';

const valueFrom = (from) => {
  if (from.config_map_key_ref) {
    const ref = from.config_map_key_ref
    return "<from key '" + ref.key + "' of config map '" + ref.name + "'> (Optional: " + boolean(ref.optional) + ")";
  } else if (from.field_ref) {
    return "<from field ref '" + from.field_ref.field_path + "'>";
  } else if (from.secret_field_ref) {
    return "TODO: secretFieldRef"
  } else if (from.resource_field_ref) {
    return "TODO: resourceFieldRef"
  }
};

const Env = ({ environment, tableClassName }) => {
  if (environment.length) {
    return (
      <DescribeInfoRow title="Environment">
        <Table className={tableClassName}>
          <TableBody>
            {environment.map(env => (
              <DescribeInfoRow title={env.name} key={env.name}>
                {env.value || valueFrom(env.value_from)}
              </DescribeInfoRow>
            ))}
          </TableBody>
        </Table>
      </DescribeInfoRow>
    );
  }

  return (null);
};

export default Env;

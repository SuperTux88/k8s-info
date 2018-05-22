import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';

import DescribeInfoRow from './DescribeInfoRow';

const Probe = ({ title, probe, tableClassName }) => {
  if (probe) {
    return (
      <DescribeInfoRow title={title}>
        <Table className={tableClassName}>
          <TableBody>
            {probe.http_get && <DescribeInfoRow title="http-get" />}
            {probe.http_get && <DescribeInfoRow title="URL">
              {probe.http_get.scheme.toLowerCase() + "://" + (probe.http_get.host || "") + ":" + probe.http_get.port + probe.http_get.path}
            </DescribeInfoRow>}

            {probe._exec && <DescribeInfoRow title="exec" />}
            {probe._exec && <DescribeInfoRow title="Command">
              {probe._exec.command.join(" ")}
            </DescribeInfoRow>}

            <DescribeInfoRow title="Timing">
              <Table className={tableClassName}>
                <TableBody>
                  {probe.initial_delay_seconds && <DescribeInfoRow title="Initial delay">{probe.initial_delay_seconds + "s"}</DescribeInfoRow>}
                  <DescribeInfoRow title="Timeout">{probe.timeout_seconds + "s"}</DescribeInfoRow>
                  <DescribeInfoRow title="Period">{probe.period_seconds + "s"}</DescribeInfoRow>
                </TableBody>
              </Table>
            </DescribeInfoRow>
            <DescribeInfoRow title="Threshold">
              <Table className={tableClassName}>
                <TableBody>
                  <DescribeInfoRow title="Success">{probe.success_threshold}</DescribeInfoRow>
                  <DescribeInfoRow title="Failure">{probe.failure_threshold}</DescribeInfoRow>
                </TableBody>
              </Table>
            </DescribeInfoRow>
          </TableBody>
        </Table>
      </DescribeInfoRow>
    );
  }

  return (null);
};

export default Probe;

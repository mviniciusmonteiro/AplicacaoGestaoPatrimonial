import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';

export interface Item {
  numberOfPatrimony: number | null;
  name: string | null;
  description: string | null;
  locationId: number | null;
  responsibleRegistration: number | null;
  projectId: number | null;
}

interface TabelaProps {
    data: Item[];
}

function ResponsiveTableExample({ data }: TabelaProps) {

  return (
    <div className="table-responsive" style={{ overflowX: 'auto' }}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>N° Patrimônio</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>ID Localização</th>
              <th>Responsável</th>
              <th>ID Projeto</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((row, index) => (
              <tr key={index}>
                <td>{row.numberOfPatrimony}</td>
                <td>{row.name}</td>
                <td>{row.description}</td>
                <td>{row.locationId}</td>
                <td>{row.responsibleRegistration}</td>
                <td>{row.projectId}</td>
              </tr>
            ))}
          </tbody>
        </Table>
    </div>
  );
}

export default ResponsiveTableExample;

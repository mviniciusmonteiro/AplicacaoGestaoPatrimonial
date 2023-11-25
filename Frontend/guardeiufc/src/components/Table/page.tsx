import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Item {
  numeroPatrimonio: string;
  nome: string;
  descricao: string;
  idLocalizacao: string;
  responsavel: string;
  idProjeto: string;
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
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.numeroPatrimonio}</td>
                <td>{row.nome}</td>
                <td>{row.descricao}</td>
                <td>{row.idLocalizacao}</td>
                <td>{row.responsavel}</td>
                <td>{row.idProjeto}</td>
              </tr>
            ))}
          </tbody>
        </Table>
    </div>
  );
}

export default ResponsiveTableExample;

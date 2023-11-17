import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import { DataTable } from 'react-native-paper';
import axios from 'axios';

const Historial = () => {
  const [atletas, setAtletas] = useState([]);
  const [historialData, setHistorialData] = useState([]);
  const [selectedAtleta, setSelectedAtleta] = useState(null);
  const modalSelectorRef = useRef(null);

  useEffect(() => {
    fetchDataFromApi();
  }, []);

  const fetchDataFromApi = async () => {
    try {
      const response = await axios.get('http://192.168.0.129/mma/api/historial');
      setAtletas(response.data);
    } catch (error) {
      console.error('Error al obtener datos de la API', error);
    }
  };

  const handleSelectAtleta = async (option) => {
    try {
      setSelectedAtleta(option.atleta);
  
      const response = await axios.get(`http://192.168.0.129/mma/api/historial-atleta/${option.atleta.id}`);
      console.log('Response from historial-atleta API:', response.data);
  
      setHistorialData(response.data.historial || []);
    } catch (error) {
      console.error('Error al obtener historial del atleta', error);
    }
  };

  // Ajusta la estructura de datos para el ModalSelector
  const selectorData = atletas.map((item) => ({
    key: item.id,
    label: `${item.cedula} -- ${item.nombre}`,
    atleta: item, // Incluye el objeto completo del atleta
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial Atletas</Text>

      <ModalSelector
        data={selectorData}
        initValue={selectedAtleta ? `${selectedAtleta.cedula} -- ${selectedAtleta.nombre}` : "Seleccione un atleta"}
        supportedOrientations={['portrait']}
        accessible={true}
        scrollViewAccessibilityLabel={'Scrollable options'}
        cancelButtonAccessibilityLabel={'cancelar'}
        onChange={(option) => handleSelectAtleta(option)}
        ref={modalSelectorRef}
        style={styles.modalSelector} // Agrega el estilo aquí
      />

      <ScrollView horizontal>

        <DataTable>
        <DataTable.Header>
          <DataTable.Title style={styles.headerTitle}>
            <Text style={{ fontSize: 20 }}>Eventos donde participo</Text>
          </DataTable.Title>
          <DataTable.Title style={styles.headerTitle}>
            <Text style={{ fontSize: 20 }}>Resultado ronda</Text>
          </DataTable.Title>
        </DataTable.Header>


          {historialData.length > 0 ? (
            historialData.map((item, index) => (
              <DataTable.Row key={item.cedula || index} style={styles.row}>
                <DataTable.Cell style={styles.cell}>
                  <Text style={{ fontSize: 20 }}>{item.nombre_evento}</Text>
                  </DataTable.Cell>
                <DataTable.Cell style={styles.cell}>
                  <Text style={{ fontSize: 20 }}>{item.resultado_ronda}</Text>
                  </DataTable.Cell>
              </DataTable.Row>
            ))
          ) : (
            <DataTable.Row key="empty">
              <DataTable.Cell colSpan={2} style={styles.cell}>
                Historial vacío
              </DataTable.Cell>
            </DataTable.Row>
          )}
        </DataTable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  headerTitle: {
    marginHorizontal: 20, 
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dataTableContainer: {
    alignItems: 'center',
  },
  cell: {
    fontSize: 19,
    paddingVertical: 9,
    paddingHorizontal: 17,
    alignItems: 'flex-start', // Alineación horizontal al centro
    justifyContent: 'flex-start', // Alineación vertical al centro
  },
  modalSelector: {
    height: 50, // ajusta la altura según tus necesidades
  },
});

export default Historial;

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ActivityIndicator, FlatList, View, TouchableOpacity, TextInput, Pressable, ToastAndroid, KeyboardAvoidingView, Platform } from 'react-native';
import { collection, doc, getDocs, setDoc, deleteDoc, updateDoc  } from "firebase/firestore"; 
import db from './src/firebase/firebaseConfig.js'
import DateTimePickerAndroid from '@react-native-community/datetimepicker';
import EditDetailsModal from './src/components/EditDetailsModal.js';

const App = () => {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [monto, setMonto] = useState('');
  const [date, setDate] = useState(new Date());
  const [fecha, setFecha] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editDataMonto, setEditDataMonto] = useState('');
  const [editDataFecha, setEditDataFecha] = useState('');
  const [editDataKey, setEditDataKey] = useState('');
  const gastosRef = collection(db, "gastos");
  
  useEffect(() => {
    cargarGastosDelDia();
    return()=>{
    }
  }, []);
  
  const cargarGastosDelDia = async() => {
    setLoading(true);
    const gastos = await getDocs(gastosRef)
    const valorData = []
    let fecha = new Date()
    let day = ''
    let year = ''
    let month = ''
    let fechaEsctructurada = ''
    gastos.forEach((gasto) => {
      fecha = gasto.data().fecha.toDate()
      year = fecha.getFullYear()
      day = fecha.getDate() < 10 ? `0${fecha.getDate()}` : fecha.getDate()
      month = fecha.getMonth() < 10 ? `0${fecha.getMonth()}` : fecha.getMonth()
      fechaEsctructurada = `${year}-${month}-${day}` 
      valorData.push({ key: gasto.id, monto: `$ ${gasto.data().monto}`, fecha: fechaEsctructurada })
    })
    setData(valorData);
    setLoading(false);
  }

  const onPressAddCost = async () => {
    if (monto != '' && fecha != '') {
      setLoading(true)
      let newRegister = { fecha: fecha, monto: monto, key: data.length }
      await setDoc(doc(gastosRef), { fecha: new Date(newRegister.fecha), monto: newRegister.monto })
      .then(()=>{
        setFecha('')
        setMonto('')
        setLoading(false)
        setData([...data, { fecha: newRegister.fecha, monto: `$ ${newRegister.monto}`, key: newRegister.key }])
        ToastAndroid.showWithGravity(
          'Gasto agregado con éxito',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      })
    }
  }
  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  }
  const onChange = ({type}, selectedDate) => {
    if (type == "set") {
      const day = selectedDate.getDate() < 10 ? `0${selectedDate.getDate()}` : selectedDate.getDate()
      const month = selectedDate.getMonth() + 1 < 10 ? `0${selectedDate.getMonth() + 1}` : selectedDate.getMonth() + 1
      const year = selectedDate.getFullYear()
      toggleDatePicker();
      setFecha(`${year}-${month}-${day}`);
    } else {
      toggleDatePicker();
    }
  }
  const updateMount = async () => {
    const updateGastosRef = doc(db, "gastos", `${editDataKey}`);
    setLoading(true);
    await updateDoc(updateGastosRef, {
      monto: editDataMonto,
      fecha: new Date(editDataFecha)
    });
    const newData = data.map(item => {
      if (item.key === editDataKey) {
        return { ...item, monto: `$ ${editDataMonto}`, fecha: editDataFecha };
      }
      return item;
    });
    setData(newData);
    setEditDataMonto('')
    setEditDataFecha('')
    setEditDataKey('')
    setLoading(false);
  }
  const toggleModalValue = (key) => {
    const objectToEdit = data.find(item => item.key === key)
    setMonto('')
    setFecha('')
    setEditDataMonto(objectToEdit.monto.replace('$ ', ''))
    setEditDataFecha(objectToEdit.fecha)
    setEditDataKey(objectToEdit.key)
    setIsModalOpen(!isModalOpen)
  }
  const deleteMount = async (key) => {
    console.log(`Eliminando: ${key}`)
    setLoading(true)
    await deleteDoc(doc(db, "gastos", `${key}`))
    const filteredData = data.filter(item => item.key !== key);
    setData(filteredData);
    setLoading(false)
  }
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      keyboardVerticalOffset={-220}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Ajuste del comportamiento según la plataforma
    >
      <View  style={styles.container}>
        <View style={{ height: '35%' }}>
          <Text style={ styles.titleText }>Mis gastos</Text>
          <View style={ styles.contentAddGasto }>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ color: '#ffffff', fontSize: 15, marginRight: 25 }}>¿Cuánto gastaste? ($): </Text>
              <TextInput
                style={styles.input}
                value={monto}
                keyboardType="numeric"
                onChangeText={setMonto}
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 30 }}>
              <Text style={{ color: '#ffffff', fontSize: 15, marginRight: 25 }}>¿Cuándo fue el gasto?: </Text>
              {showPicker && (
                <DateTimePickerAndroid
                  mode="date"
                  display="calendar"
                  value={date}
                  onChange={onChange}
                />
              )}
              {!showPicker && (
                <Pressable onPress={toggleDatePicker}>
                  <TextInput
                    style={styles.input}
                    value={fecha}
                    editable={false}
                    onChangeText={setFecha}
                  />
                </Pressable>
              )}
            </View>
            <TouchableOpacity style={styles.buttonAddCost} onPress={onPressAddCost}>
              <Text style={styles.textAddCost}>Añadir Gasto</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', justifyContent:'flex-start', width: '100%', marginTop: 20 }}>
            <Text style={{ color: 'white', width:'20%', marginLeft: 25 }}>Monto</Text>
            <Text style={{ color: 'white', width: '25%' }}>Fecha</Text>
          </View>
        </View>
        <View style={{ height: '65%' }}>
          {isLoading ? <ActivityIndicator color={'white'} style={{ height: '70%', alignSelf: 'center', marginLeft: '50%' }}/> : (
            <FlatList
              style={styles.listContainer}
              data={data}
              renderItem={({item}) => (
                <View key={item.key} style={{ flexDirection: 'row', width:'100%', justifyContent: 'space-between', backgroundColor: 'rgba(255, 255, 255, 0.8)', marginVertical: 15, paddingHorizontal: 10, marginHorizontal: 20, paddingVertical: 20, borderRadius: 10 }}>
                  <Text style={{ color:"black", fontSize: 16, width: '20%' }}>{item.monto}</Text>
                  <Text style={{ color:"black", fontSize: 16, width: '25%' }}>{item.fecha}</Text>
                  <Pressable onPress={() => {
                      toggleModalValue(item.key)
                    }
                  }>
                    <Text style={{ color:"blue", fontSize: 16, marginLeft:8, marginRight: 8 }}>Actualizar</Text>
                  </Pressable>
                  <Pressable onPress={() => {
                      deleteMount(item.key)
                    }
                  }>
                    <Text style={{ color:"red", fontSize: 16, marginLeft:8, marginRight: 8 }}>Eliminar</Text>
                  </Pressable>
                </View>
              )}
              keyExtractor={item => item.key}
              contentContainerStyle={styles.listContentContainer}
            />
          )}
        </View>
        <EditDetailsModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          editDataMonto={editDataMonto}
          setEditDataMonto={setEditDataMonto}
          editDataFecha={editDataFecha}
          setEditDataFecha={setEditDataFecha}
          callUpdateMount={updateMount} 
        />
      </View >
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'darkcyan',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 50,
    paddingBottom: 40,
    width: '100%'
  },
  titleText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center'
  },
  listContentContainer: {
    alignItems: 'center', // Centra horizontalmente los elementos
  },
  contentAddGasto: {
    flexDirection: 'col',
    justifyContent: 'space-around',
    marginTop: 20
  },
  input: {
    width: 150,
    marginRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff',
    padding: 5,
    color: '#ffffff'
  },
  buttonAddCost: {
    width: 200,
    backgroundColor: '#c74375',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center'
  },
  textAddCost: {
    textTransform: 'capitalize', // Primera letra en mayúscula y el resto en minúscula
    color: 'white',
    fontWeight: 'bold',
  },
  listContainer: {
    width: '90%',
    flex: 1
  }
});
export default App;
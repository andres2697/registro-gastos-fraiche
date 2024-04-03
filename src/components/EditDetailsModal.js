import React, {useState} from "react";
import { Text, Modal, View, Pressable, TextInput } from "react-native";
import DateTimePickerAndroid from '@react-native-community/datetimepicker';
export default function EditDetailsModal({
  isModalOpen,
  setIsModalOpen,
  editDataMonto,
  setEditDataMonto,
  editDataFecha,
  setEditDataFecha,
  callUpdateMount
}) {
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [dateModal, setDateMdateModal] = useState(new Date());

  const modalContainerStyle = {
    flex: 2,
    justifyContent: 'center'
  };
  const modalStyle = {
    paddingHorizontal: 30,
    paddingVertical: 20,
    margin: 20,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  };
  const buttonStyle = {
    paddingHorizontal: 20,
    paddingVertical: 10,
    textTransform: 'capitalize',
    backgroundColor: '#4d97d1',
    borderRadius: 10
  };
  const textButtonStyle = {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold'
  };
  const input = {
    width: 150,
    marginRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    padding: 5,
    color: '#000'
  };
  const toggleDatePickerModal = () => {
    setShowPickerModal(!showPickerModal);
  }
  const onChangeModal = ({type}, choosedDate) => {
    if (type == "set") {
      const dayModal = choosedDate.getDate() < 10 ? `0${choosedDate.getDate()}` : choosedDate.getDate()
      const monthModal = choosedDate.getMonth() + 1 < 10 ? `0${choosedDate.getMonth() + 1}` : choosedDate.getMonth() + 1
      const yearModal = choosedDate.getFullYear()
      toggleDatePickerModal();
      console.log(`${yearModal}-${monthModal}-${dayModal}`)
      setEditDataFecha(`${yearModal}-${monthModal}-${dayModal}`);
    } else {
      toggleDatePickerModal();
    }
  }
  const toggleModalAndSave = () => {
    setIsModalOpen(!setIsModalOpen)
    callUpdateMount()
  }
  return (
    <>
      <Modal visible={isModalOpen} transparent={true} animationType={'slide'}>
        <View style={ modalContainerStyle }>
          <View style={ modalStyle }>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ color: '#000', fontSize: 15, marginRight: 25 }}>Corrección de monto: </Text>
              <TextInput
                style={input}
                value={editDataMonto}
                keyboardType="numeric"
                onChangeText={setEditDataMonto}
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 30 }}>
                <Text style={{ color: '#000', fontSize: 15, marginRight: 25 }}>Corrección de fecha: </Text>
                {showPickerModal && (
                <DateTimePickerAndroid
                    mode="date"
                    display="calendar"
                    value={dateModal}
                    onChange={onChangeModal}
                />
                )}
                {!showPickerModal && (
                <Pressable onPress={toggleDatePickerModal}>
                    <TextInput
                    style={input}
                    value={editDataFecha}
                    editable={false}
                    onChangeText={setEditDataFecha}
                    />
                </Pressable>
                )}
            </View>
            <Pressable style={buttonStyle} onPress={toggleModalAndSave}>
              <Text style={textButtonStyle}>Cerrar y guardar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {TextInput, FAB, Avatar, Chip} from 'react-native-paper';
import {Formik} from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-native-date-picker';

import moment from 'moment';
import {useTranslation} from 'react-i18next';

const validationSchema = Yup.object().shape({
  taskTitle: Yup.string().required('Task title is required').label('taskTitle'),
  taskDescription: Yup.string().required('Please add some description').label('taskDescription'),
});

const AddTask = ({navigation}) => {

  const {t, i18n} = useTranslation();

  // date and time
  const [startDate, setStartDate] = useState(new Date());
  const [openStartingDate, setOpenStartingDate] = useState(false);
  const [dueDate, setDueDate] = useState(new Date());
  const [openDueDate, setOpenDueDate] = useState(false);

  const [priority, setPriority] = useState('normal');
  const priorities = ['Low', 'Normal', 'High', 'none'];

  const addHandler = async values => {
    navigation.navigate('AddTaskMembers', {
      values: values,
      startDate: `${startDate}`,
      dueDate: `${dueDate}`,
      priority: priority,
    });
  };

  return (
    <Formik
      initialValues={{
        taskTitle: '',
        taskDescription: '',
      }}
      validationSchema={validationSchema}
      onSubmit={values => addHandler(values)}>
      {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
        <View style={{flex: 1, padding: '4%', marginVertical: '2%'}}>
          <TextInput
            error={errors.taskTitle && touched.taskTitle ? true : false}
            label={t("what is to be done?")}
            mode="outlined"
            style={{marginVertical: '2%', width: '100%'}}
            onChangeText={handleChange('taskTitle')}
            onBlur={handleBlur('taskTitle')}
            value={values.taskTitle}
          />
          {errors.taskTitle && touched.taskTitle ? (
            <Text style={styles.error}>{t(errors.taskTitle)}</Text>
          ) : null}

          <TextInput
            error={errors.taskDescription && touched.taskDescription ? true : false}
            label={t("Some Description")}
            mode="outlined"
            multiline
            style={{marginVertical: '2%', maxHeight: 200, width: '100%'}}
            onChangeText={handleChange('taskDescription')}
            onBlur={handleBlur('taskDescription')}
            value={values.taskDescription}
          />
          {errors.taskDescription && touched.taskDescription ? (
            <Text style={styles.error}>{t(errors.taskDescription)}</Text>
          ) : null}

          <DatePicker
            date={startDate}
            open={openStartingDate}
            modal
            onConfirm={date => {
              setStartDate(date);
              setOpenStartingDate(false);
            }}
            onCancel={() => {
              setOpenStartingDate(false);
            }}
          />

          <DatePicker
            date={dueDate}
            open={openDueDate}
            modal
            onConfirm={date => {
              setDueDate(date);
              setOpenDueDate(false);
            }}
            onCancel={() => {
              setOpenDueDate(false);
            }}
          />

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{width: '48%', marginTop: '2%'}}>
              <Text style={{fontWeight: 'bold'}}>{t("Starting Timing")}</Text>
              <TouchableOpacity
                onPress={() => setOpenStartingDate(true)}
                style={{
                  borderRadius: 10,
                  borderColor: '#C1C2B8',
                  borderWidth: 0.5,
                  padding: '4%',
                  marginVertical: '4%',
                  textAlign: 'center',
                }}>
                <Text style={{fontWeight: 'bold'}}>{moment(startDate)?.format('lll')} </Text>
              </TouchableOpacity>
            </View>

            <View style={{width: '48%', marginTop: '2%'}}>
              <Text style={{fontWeight: 'bold'}}>{t("Due Timing")}</Text>
              <TouchableOpacity
                onPress={() => setOpenDueDate(true)}
                style={{
                  borderRadius: 10,
                  borderColor: '#C1C2B8',
                  borderWidth: 0.5,
                  padding: '4%',
                  marginVertical: '4%',
                  textAlign: 'center',
                }}>
                <Text style={{fontWeight: 'bold'}}>{moment(dueDate)?.format('lll')} </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Text style={{fontWeight: 'bold', margin: '2%'}}>{t("Priority")}</Text>
            <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
              {priorities.map((singlePriority, index) => (
                <Chip
                  key={index}
                  style={{margin: '2%'}}
                  // compact
                  ellipsizeMode="tail"
                  selected={singlePriority.toLowerCase() === priority.toLowerCase() ? true : false}
                  mode={
                    singlePriority.toLowerCase() === priority.toLowerCase() ? 'flat' : 'outlined'
                  }
                  onPress={() => setPriority(singlePriority)}>
                  {t(singlePriority)}
                </Chip>
              ))}
            </View>
          </View>

          <FAB
            mode="contained"
            onPress={handleSubmit}
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              margin: 16,
            }}
            label={t("Next")}
            icon="arrow-right"
          />
        </View>
      )}
    </Formik>
  );
};

export default AddTask;

const styles = StyleSheet.create({
  error: {
    color: 'red',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

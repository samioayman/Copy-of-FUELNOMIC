// mobile/app/screens/Register.styles.js
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { 
    padding: 20, 
    paddingTop: 50, 
    flexGrow: 1, 
    backgroundColor: '#f5f5f5' 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center', 
    color: '#333' 
  },
  input: { 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 10, 
    borderWidth: 1, 
    borderColor: '#ddd' ,
  },
  inputError: {
    borderColor: '#ff3b30',
    borderWidth: 1,
  },
  toggleContainer: { 
    marginBottom: 20 
  },
  label: { 
    fontSize: 16, 
    marginBottom: 10, 
    marginTop: 10,
    fontWeight: '600' 
  },
  row: { 
    flexDirection: 'row', 
    gap: 10 
  },
  btn: { 
    flex: 1, 
    padding: 15, 
    borderRadius: 8, 
    backgroundColor: '#e0e0e0', 
    alignItems: 'center' 
  },
  btnActive: { 
    backgroundColor: '#007AFF' 
  },
  btnText: { 
    color: '#333', 
    fontWeight: '600' 
  },
  textActive: { 
    color: '#fff' 
  },
  conditionalSection: { 
    marginBottom: 20, 
    padding: 15, 
    backgroundColor: '#fff', 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#eee' 
  },
  helperText: { 
    marginBottom: 10, 
    color: '#555' 
  },
  hint: { 
    fontSize: 12, 
    color: '#888', 
    fontStyle: 'italic', 
    marginTop: 5 
  },
  submitBtn: { 
    backgroundColor: '#28a745', 
    padding: 18, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginTop: 10 
  },
  submitText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  inputWithIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },
  inputContainerError: {
  borderColor: '#ff3b30',
},
  inputWithIcon: {
    flex: 1, // takes up available space
    padding: 15,
    backgroundColor: 'transparent',
    borderWidth: 0, // remove border since container has it
  },

  iconButton: {
    padding: 10,
    marginRight: 5,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#eef6ff', // Very light blue background
    borderWidth: 1,
    borderColor: '#007AFF', // Blue border
    borderStyle: 'dashed', // Dashed border looks like a "scanner" area
    marginBottom: 5, // space for hint
  },
  scanButtonText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15, // Space above and below "OR"
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd', // Light gray line
  },
  orText: {
    marginHorizontal: 10,
    color: '#888',
    fontWeight: 'bold',
    fontSize: 12,
  },
  errorText: {
    color: '#ff3b30', // Standard Error Red
    fontSize: 12,
    marginTop: -10, // Pull it closer to the input above
    marginBottom: 15, // Push the next element away
    marginLeft: 5,
    marginTop: 5 ,
    fontWeight: '500',
    fontStyle: 'italic',
  },


});
import React from 'react'
import { Link } from 'react-router-dom'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { reduxForm, Field } from 'redux-form'
import {Card, CardContent, CardActions, Button, Typography, withStyles, Grid} from 'material-ui'

import TextField from '../../../components/inputs/textField.component'
import { userEntry } from '../client-actions'

const mapStateToProps = state => ({
  initialValues: state.client,
})

const validate = ({ clientName, clientAddress }) => ({
  clientName: !clientName ? 'Obligatoire' : null,
  clientAddress: !clientAddress ? 'Obligatoire' : null,
})

const styles = theme => ({
  inputList: {
    marginTop: theme.spacing.unit,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
})

const ClientPage = ({ handleSubmit, pristine, invalid, classes }) => (
  <form onSubmit={handleSubmit}>
    <Card>
      <CardContent>
        <Typography type='headline' component='h2' gutterBottom>
          Informations client
        </Typography>
        <Grid container>
          <Grid item xs={6} md={4}>
            <Field
              name='clientName'
              type='text'
              label='Nom du client'
              fullWidth
              component={TextField} />
          </Grid>
          <Grid item xs={6} md={4}>
            <Field
              name='clientAddress'
              type='text'
              label='Adresse du client'
              fullWidth
              component={TextField} />
          </Grid>
          <Grid item xs={6} md={4}>
            <Field
              name='managerName'
              type='text'
              label='Nom du responsable'
              fullWidth
              component={TextField} />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button dense color='primary' type='submit' disabled={pristine || invalid}>Enregistrer</Button>
        <Button dense component={Link} to='/'>Retour à l'édition</Button>
      </CardActions>
    </Card>
  </form>
)

const HookedClientPage = reduxForm({
  form: 'clientForm',
  validate,
  onSubmit: (formData, dispatch) => {
    dispatch(userEntry(formData))
    dispatch(push('/'))
  },
})(ClientPage)

export default connect(mapStateToProps)(withStyles(styles)(HookedClientPage))

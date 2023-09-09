import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createGear, deleteGear, getGears, patchGear } from '../api/gears-api'
import Auth from '../auth/Auth'
import { Gear } from '../types/Gear'

interface GearProps {
  auth: Auth
  history: History
}

interface GearState {
  gears: Gear[]
  newGearName: string
  loadingGears: boolean
}

export class Gears extends React.PureComponent<GearProps, GearState> {
  state: GearState = {
    gears: [],
    newGearName: '',
    loadingGears: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newGearName: event.target.value })
  }

  onEditButtonClick = (gearId: string) => {
    this.props.history.push(`/gears/${gearId}/edit`)
  }

  onGearCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newGear = await createGear(this.props.auth.getIdToken(), {
        name: this.state.newGearName,
        dueDate
      })
      this.setState({
        gears: [...this.state.gears, newGear],
        newGearName: ''
      })
    } catch {
      alert('Gear creation failed')
    }
  }

  onGearDelete = async (gearId: string) => {
    try {
      await deleteGear(this.props.auth.getIdToken(), gearId)
      this.setState({
        gears: this.state.gears.filter(gear => gear.gearId !== gearId)
      })
    } catch {
      alert('gear deletion failed')
    }
  }

  onGearCheck = async (pos: number) => {
    try {
      const gear = this.state.gears[pos]
      await patchGear(this.props.auth.getIdToken(), gear.gearId, {
        name: gear.name,
        dueDate: gear.dueDate,
        done: !gear.done
      })
      this.setState({
        gears: update(this.state.gears, {
          [pos]: { done: { $set: !gear.done } }
        })
      })
    } catch {
      alert('Gear deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const gears = await getGears(this.props.auth.getIdToken())
      this.setState({
        gears,
        loadingGears: false
      })
    } catch (e) {
      alert(`Failed to fetch gears: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Gear List</Header>

        {this.renderCreateGearInput()}

        {this.renderGears()}
      </div>
    )
  }

  renderCreateGearInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'orange',
              labelPosition: 'left',
              icon: 'add',
              content: 'New gear',
              onClick: this.onGearCreate
            }}
            fluid
            actionPosition="left"
            placeholder="You have new gear?"
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderGears() {
    if (this.state.loadingGears) {
      return this.renderLoading()
    }

    return this.renderGearsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Gears
        </Loader>
      </Grid.Row>
    )
  }

  renderGearsList() {
    return (
      <Grid padded>
        {this.state.gears.map((gear, pos) => {
          return (
            <Grid.Row key={gear.gearId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onGearCheck(pos)}
                  checked={gear.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {gear.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {gear.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(gear.gearId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onGearDelete(gear.gearId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {gear.attachmentUrl && (
                <Image src={gear.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}

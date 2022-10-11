import React from 'react'
import { Text, View, Image} from 'react-native'
import {useGetPokemonByNameQuery} from '../../redux/reducers/groups/invitations/invitaionThunk'
import {Avatar} from 'react-native-paper'
function Profile() {
  const { data, isError, isLoading } = useGetPokemonByNameQuery('bulbasaur')
  return (
    <View >
    {isError ? (
      <Text>Oh no, there was an error</Text>
    ) : isLoading ? (
      <Text>Loading...</Text>
    ) : data ? (
      <View>
        <Text>{data.species.name}</Text>
        <Avatar.Image
            source={{
              uri: data.sprites.front_shiny,
            }}
            size={70}
          />
                </View>
    ) : null}
  </View>

    )
}

export default Profile
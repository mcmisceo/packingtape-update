give @s minecraft:carrot_on_a_stick{CustomModelData:67}
setblock ~ ~ ~ minecraft:dropper{Items:[{Slot:0,id:"minecraft:carrot_on_a_stick",tag:{CustomModelData:67}}]}
execute if entity @s[nbt={SelectedItem:{id:"minecraft:carrot_on_a_stick",tag:{CustomModelData:67}}}]
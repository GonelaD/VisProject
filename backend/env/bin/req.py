import os
import pandas as pd

df = pd.read_csv('OriginalData.csv')

# new_df = df.dropna()

# counts =  new_df['Country'].value_counts()

# counts = counts[counts > 14]

# print(len(counts))

drop_columns = ['Schooling','GDP',' thinness  1-19 years', ' thinness 5-9 years','percentage expenditure','Income composition of resources']


new_df = df.drop(columns=drop_columns, axis=1)


columns = ['Country', 'Year', 'Status', 'Life Expectancy', 'Adult Mortality','Infant deaths', 'Alcohol', 'Hepatitis B','Measles', 'BMI', 'Under-five deaths', 'Polio', 'Total expenditure','Diphtheria', 'HIV/AIDS', 'Population']

new_df.columns = columns

new_df = new_df.dropna()

filtered_df = new_df.groupby('Country').filter(lambda x: x['Year'].nunique() >= 5)
print("here",len(filtered_df))


# new_df.sort_values('Country')

# count = new_df.groupby('Country').size()
# new_df  = new_df.head(750)



new_df.to_csv('LIFE_EXPECTANCY_WHO.csv',index=False)
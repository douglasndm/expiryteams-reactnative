!/bin/bash

echo "Starting full build process"

cd android

echo "Building Android app"
./gradlew bundleRelease

cd ..

# echo "Starting iOS build process"
# # Caminho para o arquivo de workspace do seu projeto
# workspace="ios/expirybusiness.xcworkspace"

# # Nome do esquema do seu aplicativo
# scheme="expirybusiness"

# # Caminho onde o arquivo de arquivo será salvo
# archivePath="~/Library/Developer/Xcode/Archives/"

# # Compilar e arquivar o aplicativo
# xcodebuild -workspace "$workspace" -scheme "$scheme" -configuration Release archive -archivePath "$archivePath"

# # Verificar se a compilação foi bem-sucedida
# if [ $? -eq 0 ]; then
#     echo "Compilação e arquivamento bem-sucedidos."

#     # Abrir o Organizer do Xcode
#     open -a Xcode

#     echo "Por favor, navegue para o Organizer do Xcode para enviar para a App Store."
# else
#     echo "Erro durante a compilação e arquivamento. Por favor, verifique o log para mais detalhes."
# fi

echo "Finished build process"

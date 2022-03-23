GOOGLE_JSON_FILE=$APPCENTER_SOURCE_DIRECTORY/android/app/google-services.json
GOOGLE_SERVICE_FILE=$APPCENTER_SOURCE_DIRECTORY/ios/GoogleService-Info.plist


if [ -e "$GOOGLE_JSON_FILE" ]
then
    echo "Updating Google Json"
    echo "$GOOGLE_JSON" > $GOOGLE_JSON_FILE
    sed -i -e 's/\\"/'\"'/g' $GOOGLE_JSON_FILE

    echo "File content:"
    cat $GOOGLE_JSON_FILE
fi

if [ -e "$GOOGLE_SERVICE_FILE" ]
then
    echo "Updating Google Service Plist"
    echo "$GOOGLE_SERVICE" | base64 --decode > $GOOGLE_SERVICE_FILE
    sed -i -e 's/\\"/'\"'/g' $GOOGLE_SERVICE_FILE

    echo "File content:"
    cat $GOOGLE_SERVICE_FILE
fi

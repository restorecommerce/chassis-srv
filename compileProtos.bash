file="protoc-3.0.0-linux-x86_64.zip"
if ! [ -f "$file" ]
then
	wget https://github.com/google/protobuf/releases/download/v3.0.0/protoc-3.0.0-linux-x86_64.zip
  unzip -a -d protoc protoc-3.0.0-linux-x86_64.zip
fi
cd protos
../protoc/bin/protoc --proto_path=. --js_out=import_style=commonjs,binary:. io/restorecommerce/*.proto grpc/**/**/*.proto **/*.proto


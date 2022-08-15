export const ec2UserInitDocument = {
    schemaVersion: "2.2",
    description: "Command Document Example JSON Template",
    parameters: {
      user: {
        type: "String",
        description: "Username of the ec2 user",
        default: "exampleUser"
      },
      action: {
        type: "String",
        description: "The action type of the requested EC2 script",
        default: "None",
        allowedValues: [
          "initialize"
        ]
      },
      privateKey: {
        type: "String",
        default: "None"
      }
    },
    mainSteps: [
      {
        action: "aws:runShellScript",
        name: "InitializeUserToEC2",
        precondition: {
          StringEquals: [
            "{{ action }}",
            "initialize"
          ]
        },
        inputs: {
          runCommand: [
            "sudo adduser {{ user }}",
            "mkdir ../../home/{{ user }}/.ssh",
            "chmod 700 ../../home/{{ user }}/.ssh",
            "sudo touch ../../home/{{ user }}/.ssh/authorized_keys",
            "sudo chmod 600 ../../home/{{ user }}/.ssh/authorized_keys",
            "sudo touch ../../home/{{ user }}/notSecretKey.pem && sudo chmod 600 ../../home/{{ user }}/notSecretKey.pem",
            "sudo echo -e '{{ privateKey }}' | tail -c +2 | head -c -2 >> ../../home/{{ user }}/notSecretKey.pem",
            "sudo ssh-keygen -y -f ../../home/{{ user }}/notSecretKey.pem >> ../../home/{{ user }}/.ssh/authorized_keys",
            "sudo chown {{ user }} ../../home/{{ user }}/notSecretKey.pem ../../home/{{ user }}/.ssh ../../home/{{ user }}/.ssh/authorized_keys ../../home/{{ user }}/public.txt",
            "sudo ls -la ../../home/{{ user }}/",
            "sudo rm ../../home/{{ user }}/notSecretKey.pem",
            "exit"
          ]
        }
      }
    ]
  }
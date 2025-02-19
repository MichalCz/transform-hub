Feature: CLI tests

This feature checks CLI functionalities without topics

    @ci-api @cli
    Scenario: E2E-010 TC-001 Test 'si --help' and 'si --version' display
        Given I set config for local Hub
        When I execute CLI with "--help"
        When I execute CLI with "--version"

    @ci-api @cli
    Scenario: E2E-010 TC-002 Test 'si hub' options
        When I execute CLI with "hub --help"
        When I execute CLI with "hub load"
        When I execute CLI with "hub version"

    @ci-api @cli
    Scenario: E2E-010 TC-003 Test Sequence 'pack' option
        When I execute CLI with "seq pack data/sequences/simple-stdio  -o ../packages/simple-stdio.tar.gz"
        Then I get location "../packages/simple-stdio.tar.gz" of compressed directory

    @ci-api @cli
    Scenario: E2E-010 TC-004 Test Sequence options
        When I execute CLI with "seq --help"
        When I execute CLI with "seq send ../packages/args-to-output.tar.gz"
        When I execute CLI with "seq send ../packages/checksum-sequence.tar.gz"
        When I execute CLI with "seq send ../packages/hello-alice-out.tar.gz"
        When I execute CLI with "seq get -"
        When I execute CLI with "seq list"
        When I execute CLI with "seq delete -"
        When I execute CLI with "seq list"
        When I execute CLI with "seq prune"
        When I execute CLI with "seq list"

    # This tests writes and uses shared config file so it may fail if run in parallel
    @ci-api @cli @no-parallel
    Scenario: E2E-010 TC-005 Check minus replacements with a Sequence
        When I execute CLI with "seq pack data/sequences/simple-stdio -o data/simple-stdio.tar.gz"
        And I execute CLI with "seq send -"
        And I execute CLI with "seq start -"
        And I execute CLI with "inst info -"
        And I execute CLI with "inst kill -"
        And I wait for Instance to end
        And I execute CLI with "seq rm -"
        Then I confirm "Instance" list is empty
        Then I confirm "Sequence" list is empty

    @ci-api @cli
    Scenario: E2E-010 TC-006 Test Sequence 'prune --force' option
        When I execute CLI with "seq send ../packages/checksum-sequence.tar.gz"
        When I execute CLI with "seq send ../packages/csv-transform.tar.gz"
        When I execute CLI with "seq list"
        When I execute CLI with "seq start -"
        When I execute CLI with "inst list"
        When I execute CLI with "seq prune --force"
        Then I confirm "Instance" list is empty
        Then I confirm "Sequence" list is empty

    @ci-api @cli
    Scenario: E2E-010 TC-007 Test Instance options
        When I execute CLI with "inst --help"
        When I execute CLI with "seq send ../packages/csv-transform.tar.gz"
        When I execute CLI with "seq start -"
        When I execute CLI with "inst info -"
        When I execute CLI with "inst health -"
        When I execute CLI with "inst list"
        When I execute CLI with "inst kill -"
        And I wait for Instance to end
        Then I confirm "Instance" list is empty

    @ci-api @cli
    Scenario: E2E-010 TC-008 Test Instances 'stop' option
        When I execute CLI with "seq send ../packages/checksum-sequence.tar.gz"
        When I execute CLI with "seq start -"
        When I execute CLI with "inst ls"
        When I execute CLI with "inst stop - 3000"
        And I wait for Instance to end
        Then I confirm "Instance" list is empty
        When I execute CLI with "seq prune --force"
        Then I confirm "Sequence" list is empty

    @ci-api @cli
    Scenario: E2E-010 TC-009 Get 404 on health endpoint for finished Instance
        When I execute CLI with "seq send ../packages/inert-function.tar.gz"
        When I execute CLI with "seq start -"
        When I execute CLI with "inst health -"
        And I wait for Instance to end
        When I execute CLI with "seq prune --force"
        Then I confirm "Sequence" list is empty

    @ci-api @cli
    Scenario: E2E-010 TC-010 Test Instance 'log' option
        When I execute CLI with "seq send ../packages/inert-function.tar.gz"
        When I execute CLI with "seq start -"
        When I execute CLI with "inst log -" without waiting for the end
        Then I confirm instance logs received

    @ci-api @cli
    Scenario: E2E-010 TC-011 Test Instance 'input' option
        When I execute CLI with "seq deploy ../packages/checksum-sequence.tar.gz"
        When I execute CLI with "inst input - data/test-data/checksum.json"

    @ci-api @cli
    Scenario: E2E-010 TC-012 Test Instance 'input --end' option and confirm output received
        When I execute CLI with "seq deploy ../packages/checksum-sequence.tar.gz"
        When I execute CLI with "inst input - data/test-data/checksum.json --end"
        When I execute CLI with "inst output -"
        Then I confirm data named "checksum" received

    @ci-api @cli
    Scenario: E2E-010 TC-013 Test Instance 'event' option with payload
        When I execute CLI with "seq deploy ../packages/event-sequence-v2.tar.gz"
        When I execute CLI with "inst event emit - test-event test message"
        When I execute CLI with "inst event on - test-event-response"
        Then I get event "test-event-response" with event message "{\"eventName\":\"test-event-response\",\"message\":\"message from sequence\"}" from Instance

    @ci-api @cli
    Scenario: E2E-010 TC-013a Test Instance 'event' option without payload
        When I execute CLI with "seq deploy ../packages/event-sequence-v2.tar.gz"
        When I execute CLI with "inst event emit - test-event"
        When I execute CLI with "inst event on - test-event-response"
        Then I get event "test-event-response" with event message "{\"eventName\":\"test-event-response\",\"message\":\"message from sequence\"}" from Instance

    @ci-api @cli
    Scenario: E2E-010 TC-014 Test Sequence 'start' with multiple JSON arguments
        When I execute CLI with "seq send ../packages/args-to-output.tar.gz"
        When I execute CLI with "seq start - --args [\"Hello\",123,{\"abc\":456},[\"789\"]]"
        When I execute CLI with "inst output -" without waiting for the end
        Then I confirm data named "args-on-output" will be received

    @ci-api @cli
    Scenario: E2E-010 TC-015 Deploy uncompressed Sequence with multiple JSON arguments
        When I execute CLI with "seq deploy data/sequences/deploy-app/dist --args [\"Hello\",123,{\"abc\":456},[\"789\"]]"
        When I execute CLI with "inst output -" without waiting for the end
        Then I confirm data named "args-on-output" will be received

    @ci-api @cli
    Scenario: E2E-010 TC-016 Get Hub logs
        When I execute CLI with "hub logs" without waiting for the end
        Then I confirm Hub logs received

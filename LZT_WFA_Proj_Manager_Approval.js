/**
 * @NApiVersion 2.x
 * @NScriptType workflowactionscript
 */
define(['N/task', 'N/search', 'N/record'],
    function(task, search, record) {
        /**
         * Definition of the Suitelet script trigger point.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @Since 2016.1
         */
        function onAction(scriptContext) {
            try {
                var recId = scriptContext.newRecord.id;
                var vendorbillSearchObj = search.create({
                    type: "vendorbill",
                    filters: [
                        ["type", "anyof", "VendBill"],
                        "AND",
                        ["internalid", "anyof", recId],
                        "AND",
                        ["createdfrom.type", "anyof", "PurchOrd"]
                    ],
                    columns: [
                        search.createColumn({
                            name: "createdfrom",
                            label: "Created From"
                        })
                    ]
                });
                var searchResultCount = vendorbillSearchObj.runPaged().count;
                log.debug("vendorbillSearchObj result count", searchResultCount);

                var poInternalid;
                vendorbillSearchObj.run().each(function(result) {
                    poInternalid = result.getValue('createdfrom');
                });

                if (poInternalid) {

                    var vendorbillSearchObj = search.create({
                        type: "vendorbill",
                        filters: [
                            ["type", "anyof", "VendBill"],
                            "AND",
                            ["internalid", "anyof", recId],
                            "AND",
                            ["customer.entityid", "isnotempty", ""],
                            "AND",
                            ["taxline", "is", "F"]
                        ],
                        columns: [
                            search.createColumn({
                                name: "item",
                                label: "Item"
                            }),
                            search.createColumn({
                                name: "account",
                                label: "Account"
                            }),
                            search.createColumn({
                                name: "tranid",
                                label: "Document Number"
                            })
                        ]
                    });
                    var searchResultCount = vendorbillSearchObj.runPaged().count;
                    log.debug("vendorbillSearchObj result count", searchResultCount);
                    if (searchResultCount == 0) {
                       return 'F';
                    } else {


                        var vendorbillSearchObj = search.create({
                            type: "vendorbill",
                            filters: [
                                ["type", "anyof", "VendBill"],
                                "AND",
                                ["internalid", "anyof", recId],
                                "AND",
                                ["item.type", "noneof", "InvtPart"],
                                "AND",
                                ["item", "noneof", "@NONE@"],
                                "AND",
                                ["item", "noneof", "15328", "15327"],
                                "AND",
                                ["item.isfulfillable", "is", "F"]
                            ],
                            columns: [
                                search.createColumn({
                                    name: "altname",
                                    join: "customer",
                                    label: "Name"
                                }),
                                search.createColumn({
                                    name: "projectmanager",
                                    join: "job",
                                    label: "Project Manager"
                                }),
                                search.createColumn({
                                    name: "projectmanager",
                                    join: "CUSTCOL_PROJ",
                                    label: "Project Manager"
                                }),
                                search.createColumn({
                                    name: "custcol_proj",
                                    label: "Project(*)"
                                }),
                                search.createColumn({
                                    name: "internalid",
                                    join: "customer",
                                    label: "Internal ID"
                                }),
                                search.createColumn({
                                    name: "item",
                                    label: "Item"
                                }),
                                search.createColumn({
                                    name: "isfulfillable",
                                    join: "CUSTBODY4",
                                    label: "Can be Fulfilled"
                                })
                            ]
                        });
                        var searchResultCount = vendorbillSearchObj.runPaged().count;
                        log.debug("vendorbillSearchObj result count", searchResultCount);
                        if (searchResultCount > 0) {
                            return 'T';
                        } else {
                            log.debug('returning false');
                            return 'F';
                        }

                        var porec = record.load({
                            type: 'purchaseorder',
                            id: poInternalid
                        });
                        var itemLineCount = porec.getLineCount({
                            sublistId: 'item'
                        });

                        if (itemLineCount > 0) {
                            var itemreceiptSearchObj = search.create({
                                type: "itemreceipt",
                                filters: [
                                    ["type", "anyof", "ItemRcpt"],
                                    "AND",
                                    ["createdfrom", "anyof", poInternalid],
                                    "AND",
                                    ["mainline", "is", "T"]
                                ],
                                columns: [
                                    search.createColumn({
                                        name: "internalid",
                                        label: "Internal ID"
                                    })
                                ]
                            });
                            var searchResultCount = itemreceiptSearchObj.runPaged().count;
                            log.debug("itemreceiptSearchObj result count", searchResultCount);
                            if (searchResultCount == 0) {
                                log.debug('returning true');
                                return 'T';
                            } else {
                                log.debug('returning false');
                                return 'F';
                            }
                        } else {
                            log.debug('returning false');
                            return 'F';
                        }
                    }
                } else {
                    log.debug('else');

                    var vendorbillSearchObj = search.create({
                        type: "vendorbill",
                        filters: [
                            ["type", "anyof", "VendBill"],
                            "AND",
                            ["internalid", "anyof", recId],
                            "AND",
                            ["customer.entityid", "isnotempty", ""],
                            "AND",
                            ["taxline", "is", "F"]
                        ],
                        columns: [
                            search.createColumn({
                                name: "item",
                                label: "Item"
                            }),
                            search.createColumn({
                                name: "account",
                                label: "Account"
                            }),
                            search.createColumn({
                                name: "tranid",
                                label: "Document Number"
                            })
                        ]
                    });
                    var searchResultCount = vendorbillSearchObj.runPaged().count;
                    log.debug("vendorbillSearchObj result count", searchResultCount);
                    if (searchResultCount > 0) {
                        return 'T';
                    } else {
                        return 'F';
                    }
                }

            } catch (ex) {
                log.error(ex.name, ex.message);
            }
        }
        return {
            onAction: onAction
        };
    });
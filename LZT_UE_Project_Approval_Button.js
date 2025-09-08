/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope TargetAccount
 */
define(['N/runtime', 'N/record', 'N/search'],
    function(runtime, record, search) {
        /**
         * Function definition to be triggered before record is loaded.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type
         * @param {Form} scriptContext.form - Current form
         * @Since 2015.2
         */
        function beforeLoad(scriptContext) {
            try {

                if (scriptContext.type == "view") {
                    var newRecord = context.newRecord;
                    var id = newRecord.id;
                    var recType = newRecord.type;

                    var currentUserId = runtime.getCurrentUser().id;
                    var currentUserRole = runtime.getCurrentUser().role;

                    var requireApproval = newRecord.getValue({
                        fieldId: 'custentity_require_approval'
                    });
                    var projectManagerId = newRecord.getValue({
                        fieldId: 'projectmanager'
                    });
                    var approvalUntil = newRecord.getValue({
                        fieldId: 'custentity_approve_until'
                    });
                    var today = new Date();

                    if (requireApproval === true && (currentUserId === projectManagerId || currentUserRole === 3) && approvalUntil && today <= approvalUntil) {
                        scriptContext.form.addButton({
                            id: "custpage_mybutton",
                            label: "Reviewed & Approve Work",
                            functionName: 'onButtonClick(' + id + ',"' + recType + '")'
                        });
                        scriptContext.form.clientScriptModulePath = './LZT_CS_Reject_Attachment.js';
                    }
                }

            } catch (ex) {
                log.error(ex.name, ex.message);
            }
        }
        /**
         * Function definition to be triggered before record is loaded.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type
         * @Since 2015.2
         */
        function beforeSubmit(scriptContext) {}
        /**
         * Function definition to be triggered before record is loaded.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type
         * @Since 2015.2
         */
        function afterSubmit(scriptContext) {
            try {} catch (ex) {
                log.error(ex.name, ex.message);
            }
        }
        return {
            beforeLoad: beforeLoad,
            beforeSubmit: beforeSubmit,
            afterSubmit: afterSubmit
        };
    });
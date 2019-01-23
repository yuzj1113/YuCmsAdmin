<!DOCTYPE HTML>
<html xmlns="http://www.w3.org/1999/html">
<head>
    <?php if (SITE_URL) :?>
        <base href="<?php echo SITE_URL;?>" />
    <?php endif;?>
    <!--[if lt IE 9]>
    <script type="text/javascript" src="lib/html5.js"></script>
    <script type="text/javascript" src="lib/respond.min.js"></script>
    <script type="text/javascript" src="lib/PIE_IE678.js"></script>
    <![endif]-->
    <link href="css/H-ui.min.css" rel="stylesheet" type="text/css" />
    <link href="css/H-ui.admin.css" rel="stylesheet" type="text/css" />
    <link href="css/style.css" rel="stylesheet" type="text/css" />
    <!--[if IE 6]>
    <script type="text/javascript" src="http://lib.h-ui.net/DD_belatedPNG_0.0.8a-min.js" ></script>
    <script>DD_belatedPNG.fix('*');</script>
    <![endif]-->
</head>
<body>
<div class="pd-20">
    <!-- 	<form action="/" method="post" class="form form-horizontal" id="form-change-password"> -->
    <?php $form = $this->beginWidget('CActiveForm', array(
        'id'                   => 'edit-form',
        'enableAjaxValidation' => false,
        'htmlOptions'          => array('class'=>'form form-horizontal')
    )); ?>
    <div class="row cl">
        <?php echo $form->labelEx($model,'menu_name',array('class'=>'form-label col-3')); ?>
        <div class="formControls col-3"><?php echo $form->textField($model,'menu_name', array('class' => 'input-text'));?></div>
        <div class="col-3"> </div>
    </div>
    <div class="row cl">
        <?php echo $form->labelEx($model,'pid',array('class'=>'form-label col-3')); ?>
        <div class="formControls col-3"><?php echo $form->DropDownList($model,'pid', $menuList, array('empty' => array('0' => '--顶级--'),'class'=>'select')); ?></div>
        <div class="col-3"> </div>
    </div>
    <div class="row cl">
        <?php echo $form->labelEx($model,'itemname',array('class'=>'form-label col-3')); ?>
        <div class="formControls col-3"><?php echo $form->DropDownList($model,'itemname', $itemNames, array('empty' => array('' => '--无--'),'class'=>'select')); ?></div>
        <div class="col-3"> </div>
    </div>
    <div class="row cl">
        <div class="col-8 col-offset-3">
            <input class="btn btn-primary radius" type="button" url="<?php echo $model->menu_id ? $this->createUrl('menu/edit/id/'.$model->menu_id) : $this->createUrl('add')?>"value="&nbsp;&nbsp;保存&nbsp;&nbsp;">
        </div>
    </div>
    <?php $this->endWidget(); ?>
</div>
<script type="text/javascript" src="lib/jquery/1.9.1/jquery.min.js"></script>
<script type="text/javascript" src="lib/Validform/5.3.2/Validform.min.js"></script>
<script type="text/javascript" src="lib/layer/1.9.3/layer.js"></script>
<script type="text/javascript" src="js/H-ui.js"></script>
<script type="text/javascript" src="js/H-ui.admin.js"></script>
<script>
    $(function(){
        $('.btn').click(function(){
            $.ajax({
                type:'POST',
                url: $(this).attr('url'),
                dataType:'json',
                data:$('#edit-form').serialize(),
                success:function(r){
                    if (r.status == 1)
                    {
                        layer.msg(r.msg,{icon:1,time:2000},function(){
                            //var index = parent.layer.getFrameIndex(window.name);
                            //parent.layer.close(index);
                            layer_close();
                            window.location.href = r.data.url;
                        });
                    } else
                    {
                        layer.msg(r.msg,{icon:2,time:2000});
                    }
                }
            });
        })
    });
</script>
</body>
</html>